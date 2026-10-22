import React, { useState } from 'react';
import './EvidenceSection.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '../ui';
import { BookOpen, Sparkles, ExternalLink, ShieldCheck, Bookmark, FileText } from 'lucide-react';

export const EvidenceSection = ({
  citations = [],
  className = ''
}) => {
  const [selectedCitation, setSelectedCitation] = useState(null);

  return (
    <div className={`ayur-evidence-wrap ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-evidence-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="accent" variant="solid" size="sm" icon={<BookOpen size={12} />}>
                Retrieval-Augmented Generation (RAG)
              </Badge>
              <Badge color="primary" variant="subtle" size="sm">
                Classical Knowledge Base
              </Badge>
            </div>
            <span className="ayur-demo-badge">Knowledge base citations</span>
          </div>

          <CardTitle as="h2" className="ayur-evidence-title">
            Evidence Grounding & <span className="ayur-evidence-highlight">Canonical Citations</span>
          </CardTitle>

          <CardDescription className="ayur-evidence-desc">
            All AI recommendations and constitutional patterns are grounded in classical medical treatises and peer-reviewed circadian biology.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {citations.length === 0 ? (
            <div className="ayur-evidence-empty text-center py-lg">
              <FileText size={28} className="text-muted mx-auto mb-xs" />
              <p className="text-small text-muted max-w-md mx-auto">
                No specific classical compendium citations matched your current parameters. General Ayurvedic constitutional principles apply.
              </p>
            </div>
          ) : (
            <div className="ayur-evidence-grid">
              {citations.map((cite, idx) => (
                <div key={cite.id || cite.referenceId || idx} className="ayur-evidence-item-card">
                  <div className="ayur-evidence-item-top">
                    <span className="ayur-evidence-ref-id">{cite.referenceId || cite.source || `REF-${idx + 1}`}</span>
                    <span className="ayur-evidence-domain-tag">{cite.domain || 'Classical Principle'}</span>
                  </div>

                  <h3 className="ayur-evidence-item-title">{cite.title || cite.source}</h3>

                  {(cite.classicalVerse || cite.retrieved_text) && (
                    <div className="ayur-evidence-verse-box">
                      <span className="ayur-evidence-verse">"{cite.classicalVerse || cite.retrieved_text}"</span>
                    </div>
                  )}

                  <p className="ayur-evidence-insight">{cite.insight || cite.translation || cite.passage}</p>

                  <div className="ayur-evidence-footer">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<FileText size={13} />}
                      onClick={() => setSelectedCitation(cite)}
                    >
                      View Citation Context
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal / Detailed Evidence Drawer */}
          {selectedCitation && (
            <div className="ayur-evidence-modal-backdrop" onClick={() => setSelectedCitation(null)}>
              <div className="ayur-evidence-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="ayur-evidence-modal-header">
                  <div className="flex items-center gap-xs">
                    <Bookmark size={18} className="text-accent" />
                    <h3 className="ayur-evidence-modal-title">{selectedCitation.title}</h3>
                  </div>
                  <span className="ayur-evidence-ref-id">{selectedCitation.referenceId}</span>
                </div>

                <div className="ayur-evidence-modal-body">
                  <div className="ayur-evidence-modal-row">
                    <span className="font-semibold text-caption text-muted">Knowledge Domain:</span>
                    <span className="text-small text-primary">{selectedCitation.domain}</span>
                  </div>
                  {selectedCitation.publisher && (
                    <div className="ayur-evidence-modal-row">
                      <span className="font-semibold text-caption text-muted">Publisher & Authority:</span>
                      <span className="text-small text-primary">{selectedCitation.publisher}</span>
                    </div>
                  )}
                  {selectedCitation.license && (
                    <div className="ayur-evidence-modal-row">
                      <span className="font-semibold text-caption text-muted">License / Reuse Terms:</span>
                      <span className="text-small text-muted">{selectedCitation.license}</span>
                    </div>
                  )}
                  {selectedCitation.classicalVerse && (
                    <div className="ayur-evidence-modal-row">
                      <span className="font-semibold text-caption text-muted">Canonical Reference:</span>
                      <p className="text-small text-primary italic font-serif">"{selectedCitation.classicalVerse}"</p>
                    </div>
                  )}
                  <div className="ayur-evidence-modal-row">
                    <span className="font-semibold text-caption text-muted">Clinical Evidence & Passage:</span>
                    <p className="text-small text-secondary">{selectedCitation.passage || selectedCitation.insight || selectedCitation.translation}</p>
                  </div>
                  {selectedCitation.limitations && (
                    <div className="ayur-evidence-modal-row">
                      <span className="font-semibold text-caption text-muted">Known Clinical Limitations:</span>
                      <p className="text-caption text-muted italic">{selectedCitation.limitations}</p>
                    </div>
                  )}
                </div>

                <div className="ayur-evidence-modal-footer flex items-center justify-between">
                  {selectedCitation.source_url ? (
                    <a
                      href={selectedCitation.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-caption text-accent flex items-center gap-xs font-semibold hover:underline"
                    >
                      <ExternalLink size={14} /> Open Official Source
                    </a>
                  ) : <span />}
                  <Button variant="primary" size="sm" onClick={() => setSelectedCitation(null)}>
                    Close Citation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
