// LLM provider abstraction for the ICM pipeline.
// Swappable via LLM_PROVIDER env: 'mock' (default, no key) | 'vertex' (Gemini on Vertex AI, BAA).
// The Vertex implementation is stubbed until GCP credentials are provided — the rest of the
// pipeline is fully built and testable against the mock today.

export interface GenerateOpts {
  stage: 'extraction' | 'synthesis';
  systemInstruction: string;
  prompt: string;
  temperature: number;
}

export interface LlmProvider {
  name: string;          // recorded as model provenance on each draft
  generate(opts: GenerateOpts): Promise<string>;
}

// ---------- Mock provider: deterministic, no network, no key ----------
// Produces plausible, structured stage output so the whole pipeline (extract -> synthesize ->
// approve -> distribute) and the emergency-escalation path can be exercised end-to-end.
class MockProvider implements LlmProvider {
  name = 'mock';
  async generate(opts: GenerateOpts): Promise<string> {
    const text = opts.prompt;

    if (opts.stage === 'extraction') {
      // Stage 2: extraction — echo the raw text into a structured skeleton.
      const meds = (text.match(/\b\d+\s?(mg|mcg|mL|%)\b/gi) || []).slice(0, 5);
      return [
        '# EXTRACTED CLINICAL DATA (mock)',
        '## Medications',
        meds.length ? meds.map((m, i) => `- Med${i + 1}: dose ${m} [route NOT SPECIFIED] [freq UNCLEAR]`).join('\n')
                    : '- (none detected)',
        // Preserve the source text (drug names, etc.) so downstream synthesis can cross-reference.
        // Real Gemini retains this; the mock must too or the safety checks have nothing to see.
        '## Source excerpt',
        text,
      ].join('\n');
    }

    // Stage 3: synthesis — cross-reference + emit SYSTEM ALERT on a known trigger.
    // Deterministic escalation trigger for testing: presence of "warfarin" + "aspirin",
    // or the literal token "ESCALATE_TEST".
    const lc = text.toLowerCase();
    const escalate = (lc.includes('warfarin') && lc.includes('aspirin')) || text.includes('ESCALATE_TEST');
    const lines = [
      '# SYNTHESIS DRAFT (mock)',
      '## Family message',
      '- Plain-language summary of the visit for the family.',
    ];
    if (escalate) {
      lines.unshift('⛔ SYSTEM ALERT: potential drug interaction detected — HALT for NP review.');
    }
    return lines.join('\n');
  }
}

// ---------- Vertex provider: stub until GCP creds exist ----------
class VertexProviderStub implements LlmProvider {
  name = `vertex:${process.env.GEMINI_MODEL || 'gemini-2.5-pro'}`;
  async generate(_opts: GenerateOpts): Promise<string> {
    throw new Error(
      'Vertex AI provider not yet wired. Provide GCP_PROJECT_ID, GCP_LOCATION, and ' +
      'GOOGLE_APPLICATION_CREDENTIALS, then add @google/genai in vertex mode here.'
    );
  }
}

let cached: LlmProvider | null = null;
export function getProvider(): LlmProvider {
  if (cached) return cached;
  const choice = (process.env.LLM_PROVIDER || 'mock').toLowerCase();
  cached = choice === 'vertex' ? new VertexProviderStub() : new MockProvider();
  return cached;
}
