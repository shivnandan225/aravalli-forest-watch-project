/**
 * 60-Second Demo Story Runner for Hackathon Presentation
 * Simple, natural, and friendly steps showing how human intervention works:
 * Step 1: A sensor hears a suspicious buzzing noise like a chainsaw.
 * Step 2: The system sends an alert to the local beat guard's phone.
 * Step 3: Guard didn't answer within 60s → Reminder automatically sent to supervisor.
 * Step 4: The sound is heard a second time! Instantly alerts Head Forest Office.
 * Step 5: Duty Officer Vikram Singh inspects the trees on site and records findings.
 * Step 6: Gemini AI creates a clean, factual summary report for everyone to see.
 */

export interface StoryStep {
  stepIndex: number;
  title: string;
  detail: string;
  durationMs: number;
}

export class DemoStoryRunner {
  private abortController: AbortController | null = null;
  private isRunning = false;

  public async run(
    onStepUpdate: (step: StoryStep) => void,
    onComplete: () => void,
    callbacks: {
      triggerAcousticAlert: () => Promise<string | void>;
      triggerRepeatAlert: (caseId: string) => Promise<void>;
      acknowledgeCase: (caseId: string) => Promise<void>;
      generateReport: (caseId: string) => Promise<void>;
      refreshData: () => Promise<void>;
    }
  ) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.abortController = new AbortController();

    try {
      // Step 1: Acoustic trigger (0s -> 6s)
      onStepUpdate({
        stepIndex: 1,
        title: 'Step 1/6: A Sensor in the Hills Hears a Suspicious Buzz',
        detail: 'Node ACOUSTIC-NOD-4B near Udaipur detects a sound pattern resembling a motorized tree saw. It does not accuse anyone — it simply asks a human to check.',
        durationMs: 6000,
      });
      const caseId = (await callbacks.triggerAcousticAlert()) || 'case-arv-101';
      await callbacks.refreshData();
      await this.sleep(6000);

      // Step 2: Level 1 dispatched (6s -> 14s)
      onStepUpdate({
        stepIndex: 2,
        title: 'Step 2/6: An Alert is Sent to Local Forest Guards',
        detail: 'The nearest beat guards receive a notification on their device. A friendly countdown starts giving them time to respond from patrol.',
        durationMs: 8000,
      });
      await callbacks.refreshData();
      await this.sleep(8000);

      // Step 3: Timeout escalation to Level 2 (14s -> 22s)
      onStepUpdate({
        stepIndex: 3,
        title: 'Step 3/6: Guard is Busy → Reminder Sent to Supervisor',
        detail: 'Because no one answered within the window, the system automatically reminds the Range Officer so this alert is never forgotten or lost.',
        durationMs: 8000,
      });
      await callbacks.refreshData();
      await this.sleep(8000);

      // Step 4: Repeat detection triggers instant escalation to Level 3 (22s -> 32s)
      onStepUpdate({
        stepIndex: 4,
        title: 'Step 4/6: The Sound is Heard Again! Head Office Alerted',
        detail: 'A second sound spike is detected from the same node. The system treats this with high urgency and alerts the senior Head Office.',
        durationMs: 10000,
      });
      await callbacks.triggerRepeatAlert(caseId);
      await callbacks.refreshData();
      await this.sleep(10000);

      // Step 5: Duty Officer Acknowledgment (32s -> 42s)
      onStepUpdate({
        stepIndex: 5,
        title: 'Step 5/6: Officer Vikram Arrives on Ground & Confirms',
        detail: 'Ranger Vikram visits the ridge, verifies that illegal tree cutting was attempted, stops the activity, and submits his official ground notes.',
        durationMs: 10000,
      });
      await callbacks.acknowledgeCase(caseId);
      await callbacks.refreshData();
      await this.sleep(10000);

      // Step 6: Gen-AI Incident Report Generation (42s -> 60s)
      onStepUpdate({
        stepIndex: 6,
        title: 'Step 6/6: Gemini AI Compiles a Clear Bilingual Report',
        detail: 'The system automatically writes a clean, factual summary in English and Hindi recording the full timeline from first sound to human inspection.',
        durationMs: 10000,
      });
      await callbacks.generateReport(caseId);
      await callbacks.refreshData();
      await this.sleep(8000);

      onComplete();
    } catch (e) {
      console.log('Story finished or interrupted', e);
    } finally {
      this.isRunning = false;
    }
  }

  public stop() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isRunning = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
