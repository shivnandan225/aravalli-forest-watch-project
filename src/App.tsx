import React, { useState, useEffect, useRef } from 'react';
import { Language, EscalationCase, NotificationPayload, WeatherData, IncidentReport } from './types';
import { Navbar } from './components/Navbar';
import { PageEntry } from './components/PageEntry';
import { PageWhyForests } from './components/PageWhyForests';
import { PageConsole } from './components/PageConsole';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AccuracyDrawer } from './components/AccuracyDrawer';
import { DemoOutboxModal } from './components/DemoOutboxModal';
import { IncidentReportModal } from './components/IncidentReportModal';
import { DemoStoryRunner, StoryStep } from './demo/storyRunner';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentPage, setCurrentPage] = useState<'entry' | 'why' | 'console'>('entry');
  const [cases, setCases] = useState<EscalationCase[]>([]);
  const [outbox, setOutbox] = useState<NotificationPayload[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Modals state
  const [isAccuracyOpen, setIsAccuracyOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isOutboxOpen, setIsOutboxOpen] = useState(false);
  const [activeReportCase, setActiveReportCase] = useState<{ id: string; report: IncidentReport } | null>(null);

  // 60-second pitch runner state
  const [isStoryRunning, setIsStoryRunning] = useState(false);
  const [activeStoryStep, setActiveStoryStep] = useState<StoryStep | null>(null);
  const storyRunnerRef = useRef<DemoStoryRunner | null>(null);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const res = await fetch('/api/escalations');
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
        setOutbox(data.outbox || []);
      }
    } catch (e) {
      console.warn('Backend fetch error:', e);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (e) {
      console.warn('Weather fetch error:', e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchWeather();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Alert Trigger Handler (POST /api/alerts)
  const handleTriggerAlert = async (alertData: any): Promise<string | void> => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });
      const data = await res.json();
      await fetchData();
      return data.case?.id;
    } catch (err) {
      console.error('Trigger alert error:', err);
    }
  };

  // Acknowledge Handler
  const handleAcknowledge = async (
    caseId: string,
    officerName: string,
    resolutionStatus: 'Verified' | 'Dismissed',
    notes: string
  ) => {
    try {
      await fetch(`/api/escalations/${caseId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerName, resolutionStatus, notes }),
      });
      await fetchData();
    } catch (err) {
      console.error('Ack error:', err);
    }
  };

  // Status Update Handler
  const handleUpdateStatus = async (caseId: string, status: any) => {
    try {
      await fetch(`/api/escalations/${caseId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actor: 'Duty Ranger' }),
      });
      await fetchData();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  // Generate Incident Report (POST /api/ai/incident-report)
  const handleGenerateReport = async (caseId: string) => {
    try {
      const res = await fetch('/api/ai/incident-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setActiveReportCase({ id: caseId, report: data.report });
        await fetchData();
      }
    } catch (err) {
      console.error('Generate report error:', err);
    }
  };

  // Repeat Detection Handler (Instant Escalation Rule)
  const handleRepeatDetection = async (caseItem: EscalationCase) => {
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: caseItem.deviceId,
          kind: caseItem.kind,
          category: caseItem.category,
          title: `Secondary Repeat Anomaly on ${caseItem.deviceId}`,
          lat: caseItem.latitude,
          lng: caseItem.longitude,
          replyWindowSeconds: caseItem.replyWindowSeconds,
        }),
      });
      await fetchData();
    } catch (err) {
      console.error('Repeat detection error:', err);
    }
  };

  // Reset Demo Cases
  const handleResetDemo = async () => {
    try {
      await fetch('/api/escalations/reset-demo', { method: 'POST' });
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Run 60-Second Demo Story
  const handleRunDemoStory = () => {
    if (isStoryRunning) return;
    setCurrentPage('console');
    setIsStoryRunning(true);

    if (!storyRunnerRef.current) {
      storyRunnerRef.current = new DemoStoryRunner();
    }

    storyRunnerRef.current.run(
      (step) => {
        setActiveStoryStep(step);
      },
      () => {
        setIsStoryRunning(false);
        setActiveStoryStep(null);
      },
      {
        triggerAcousticAlert: async () => {
          const res = await fetch('/api/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'Sustained Acoustic Anomaly — High-RPM Saw Resonance',
              kind: 'suspected tree-cutting acoustic',
              category: 'Acoustic',
              confidence: 0.93,
              deviceId: 'ACOUSTIC-NOD-4B',
              lat: 24.5912,
              lng: 73.6645,
              replyWindowSeconds: 8, // fast window for pitch demo
            }),
          });
          const d = await res.json();
          return d.case?.id;
        },
        triggerRepeatAlert: async (caseId: string) => {
          await fetch('/api/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deviceId: 'ACOUSTIC-NOD-4B',
              kind: 'suspected tree-cutting acoustic',
              category: 'Acoustic',
              title: 'Secondary Acoustic Surge on ACOUSTIC-NOD-4B',
              replyWindowSeconds: 8,
            }),
          });
        },
        acknowledgeCase: async (caseId: string) => {
          await fetch(`/api/escalations/${caseId}/acknowledge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              officerName: 'Ranger Vikram Singh Rathore (DFO Udaipur)',
              resolutionStatus: 'Verified',
              notes: 'Ground patrol arrived at Sector 4 pass. Motorized tree felling stopped. Equipment secured.',
            }),
          });
        },
        generateReport: async (caseId: string) => {
          const res = await fetch('/api/ai/incident-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caseId }),
          });
          const d = await res.json();
          if (d.report) {
            setActiveReportCase({ id: caseId, report: d.report });
          }
        },
        refreshData: fetchData,
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#101b15] text-[#f0fdf4] font-sans selection:bg-[#c9d99f] selection:text-[#101b15]">
      {/* Top Navigation Bar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        weather={weather}
        outboxCount={outbox.length}
        onOpenOutbox={() => setIsOutboxOpen(true)}
        onOpenAccuracy={() => setIsAccuracyOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onRunDemoStory={handleRunDemoStory}
        onResetDemo={handleResetDemo}
        isStoryRunning={isStoryRunning}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Page Routing */}
      {currentPage === 'entry' && (
        <PageEntry
          language={language}
          onNext={() => setCurrentPage('why')}
          onSkipToConsole={() => setCurrentPage('console')}
        />
      )}

      {currentPage === 'why' && (
        <PageWhyForests
          language={language}
          onEnterWatch={() => setCurrentPage('console')}
          onBack={() => setCurrentPage('entry')}
        />
      )}

      {currentPage === 'console' && (
        <PageConsole
          language={language}
          cases={cases}
          onTriggerAlert={handleTriggerAlert}
          onAcknowledge={handleAcknowledge}
          onUpdateStatus={handleUpdateStatus}
          onGenerateReport={handleGenerateReport}
          onRepeatDetection={handleRepeatDetection}
          activeStoryStep={activeStoryStep}
          onRunDemoStory={handleRunDemoStory}
          isStoryRunning={isStoryRunning}
          onBackToEntry={() => setCurrentPage('entry')}
          onBackToWhy={() => setCurrentPage('why')}
        />
      )}

      {/* Floating System Modals */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        language={language}
      />

      <AccuracyDrawer
        isOpen={isAccuracyOpen}
        onClose={() => setIsAccuracyOpen(false)}
        language={language}
      />

      <DemoOutboxModal
        isOpen={isOutboxOpen}
        onClose={() => setIsOutboxOpen(false)}
        language={language}
        outbox={outbox}
      />

      {activeReportCase && (
        <IncidentReportModal
          isOpen={!!activeReportCase}
          onClose={() => setActiveReportCase(null)}
          report={activeReportCase.report}
          caseId={activeReportCase.id}
          language={language}
        />
      )}
    </div>
  );
}
