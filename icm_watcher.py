import os
import time
import shutil
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from google import genai

# Securely load API Key from environment variable
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Define ICM Directory Structure
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIR_INGESTION = os.path.join(BASE_DIR, "01_Ingestion")
DIR_EXTRACTION = os.path.join(BASE_DIR, "02_Extraction")
DIR_SYNTHESIS = os.path.join(BASE_DIR, "03_Synthesis")
DIR_REFERENCE = os.path.join(BASE_DIR, "Reference_Material")
DIR_ARCHIVE = os.path.join(BASE_DIR, "00_Archive")

class ICMHandler(PatternMatchingEventHandler):
    patterns = ["*.md"]

    def on_created(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)

        # Give the file system a split second to finish writing the file
        time.sleep(1)

        # STAGE 2: INGESTION -> EXTRACTION
        if DIR_INGESTION in filepath and "_Raw.md" in filename:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Detected new raw file: {filename}. Starting Extraction...")
            self.run_extraction(filepath, filename)

        # STAGE 3: EXTRACTION -> SYNTHESIS
        elif DIR_EXTRACTION in filepath and "_Extracted.md" in filename:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Detected extracted file: {filename}. Starting Synthesis...")
            self.run_synthesis(filepath, filename)

    def run_extraction(self, raw_filepath, filename):
        """
        Stage 2: Extract structured data from raw clinical text.
        Deterministic parsing with temperature=0.0
        """
        try:
            # 1. Load the Stage Contract & Raw Data
            context_path = os.path.join(DIR_EXTRACTION, "CONTEXT.md")
            if not os.path.exists(context_path):
                print(f"ERROR: CONTEXT.md not found in {DIR_EXTRACTION}")
                return

            with open(context_path, "r") as f:
                system_instruction = f.read()

            with open(raw_filepath, "r") as f:
                raw_text = f.read()

            # 2. Call the LLM with deterministic settings
            print(f"  → Calling Gemini for extraction...")
            response = client.models.generate_content(
                model='gemini-2.5-pro',
                contents=raw_text,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.0  # Extraction must be strictly deterministic
                )
            )

            # 3. Route Files
            new_filename = filename.replace("_Raw.md", "_Extracted.md")
            extracted_filepath = os.path.join(DIR_EXTRACTION, new_filename)

            with open(extracted_filepath, "w") as f:
                f.write(response.text)

            # Archive the original raw file
            os.makedirs(DIR_ARCHIVE, exist_ok=True)
            shutil.move(raw_filepath, os.path.join(DIR_ARCHIVE, filename))

            print(f"  ✓ Extraction complete. Routed to {extracted_filepath}")
        except Exception as e:
            print(f"  ✗ ERROR during extraction: {str(e)}")

    def run_synthesis(self, extracted_filepath, filename):
        """
        Stage 3: Synthesize extracted data with family context.
        Cross-reference allergies and medications. Generate age-appropriate messages.
        Temperature=0.2 allows slight variance for translation/summarization.
        HALTS for human review - does NOT auto-route to distribution.
        """
        try:
            # 1. Load the Stage Contract, Extracted Data, and Factory Config
            context_path = os.path.join(DIR_SYNTHESIS, "CONTEXT.md")
            family_profiles_path = os.path.join(DIR_REFERENCE, "Family_Profiles.md")

            if not os.path.exists(context_path):
                print(f"ERROR: CONTEXT.md not found in {DIR_SYNTHESIS}")
                return
            if not os.path.exists(family_profiles_path):
                print(f"ERROR: Family_Profiles.md not found in {DIR_REFERENCE}")
                return

            with open(context_path, "r") as f:
                system_instruction = f.read()

            with open(family_profiles_path, "r") as f:
                family_profiles = f.read()

            with open(extracted_filepath, "r") as f:
                extracted_data = f.read()

            # 2. Call the LLM with both contexts
            prompt = f"FACTORY CONFIG:\n{family_profiles}\n\nEXTRACTED DATA:\n{extracted_data}"

            print(f"  → Calling Gemini for synthesis...")
            response = client.models.generate_content(
                model='gemini-2.5-pro',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.2  # Slight variance allowed for translation/summarization
                )
            )

            # 3. Route Files - HALT for Human Review
            new_filename = filename.replace("_Extracted.md", "_Draft.md")
            draft_filepath = os.path.join(DIR_SYNTHESIS, new_filename)

            with open(draft_filepath, "w") as f:
                f.write(response.text)

            print(f"  ✓ Synthesis complete. Draft awaiting review at:")
            print(f"    {draft_filepath}")
            print(f"  → NEXT STEP: Review the draft file. Rename to '_Draft_APPROVED.md' to trigger distribution.")
        except Exception as e:
            print(f"  ✗ ERROR during synthesis: {str(e)}")

if __name__ == "__main__":
    # Ensure directories exist
    for d in [DIR_INGESTION, DIR_EXTRACTION, DIR_SYNTHESIS, DIR_REFERENCE, DIR_ARCHIVE]:
        os.makedirs(d, exist_ok=True)

    observer = Observer()
    event_handler = ICMHandler()

    # Watch both Ingestion and Extraction folders
    observer.schedule(event_handler, DIR_INGESTION, recursive=False)
    observer.schedule(event_handler, DIR_EXTRACTION, recursive=False)

    observer.start()
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] ICM Watcher initialized. Monitoring folders:")
    print(f"  • {DIR_INGESTION}")
    print(f"  • {DIR_EXTRACTION}")
    print(f"  Waiting for _Raw.md and _Extracted.md files...\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down observer...")
        observer.stop()
    observer.join()
