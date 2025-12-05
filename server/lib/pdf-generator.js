import PdfPrinter from 'pdfmake';

// Define fonts
const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts);

/**
 * Generate a comprehensive PDF report from analysis data
 */
export function generateAnalysisPDF(analysis) {
  const companyName = analysis.company?.name || 'Company';
  const cheatSheet = analysis.cheatSheet || {};
  const companyProfile = analysis.companyProfile || {};
  const competitiveAnalysis = analysis.competitiveAnalysis || {};
  const opportunities = analysis.opportunities?.opportunities || [];
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const content = [];

  // ===== COVER PAGE =====
  content.push({
    text: 'AURORA',
    style: 'brand',
    alignment: 'center',
    margin: [0, 100, 0, 10]
  });
  content.push({
    text: 'Sales Intelligence Report',
    style: 'subtitle',
    alignment: 'center',
    margin: [0, 0, 0, 50]
  });
  content.push({
    text: companyName,
    style: 'companyTitle',
    alignment: 'center',
    margin: [0, 0, 0, 20]
  });
  content.push({
    text: analysis.company?.domain || '',
    style: 'domain',
    alignment: 'center',
    margin: [0, 0, 0, 100]
  });
  content.push({
    text: `Generated: ${date}`,
    style: 'date',
    alignment: 'center'
  });
  content.push({ text: '', pageBreak: 'after' });

  // ===== TABLE OF CONTENTS =====
  content.push({
    text: 'Table of Contents',
    style: 'sectionHeader',
    margin: [0, 0, 0, 20]
  });
  content.push({
    ul: [
      'Executive Summary',
      'Company Snapshot',
      'Top Opportunities',
      'Competitive Analysis',
      'Conversation Hooks & Objection Handlers',
      'Detailed Opportunities',
      'Appendix: Full Data'
    ],
    style: 'toc'
  });
  content.push({ text: '', pageBreak: 'after' });

  // ===== EXECUTIVE SUMMARY =====
  content.push({
    text: '1. Executive Summary',
    style: 'sectionHeader',
    margin: [0, 0, 0, 15]
  });

  if (cheatSheet.companySnapshot) {
    content.push({
      text: cheatSheet.companySnapshot.oneLiner || `Analysis of ${companyName}`,
      style: 'highlight',
      margin: [0, 0, 0, 15]
    });
  }

  // Key highlights
  const highlights = [];
  if (cheatSheet.companySnapshot?.techMaturity) {
    highlights.push(`Tech Maturity: ${cheatSheet.companySnapshot.techMaturity.toUpperCase()}`);
  }
  if (opportunities.length > 0) {
    highlights.push(`${opportunities.length} identified opportunities`);
  }
  if (competitiveAnalysis.matrix?.length) {
    highlights.push(`${competitiveAnalysis.matrix.length} competitors analyzed`);
  }

  if (highlights.length > 0) {
    content.push({
      ul: highlights,
      margin: [0, 0, 0, 20]
    });
  }
  content.push({ text: '', pageBreak: 'after' });

  // ===== COMPANY SNAPSHOT =====
  content.push({
    text: '2. Company Snapshot',
    style: 'sectionHeader',
    margin: [0, 0, 0, 15]
  });

  if (cheatSheet.companySnapshot) {
    const snapshot = cheatSheet.companySnapshot;
    const snapshotTable = {
      table: {
        widths: ['30%', '70%'],
        body: [
          [{ text: 'Company', style: 'tableHeader' }, snapshot.name || companyName],
          [{ text: 'Industry', style: 'tableHeader' }, snapshot.industry || 'N/A'],
          [{ text: 'Size', style: 'tableHeader' }, snapshot.size || 'N/A'],
          [{ text: 'Headquarters', style: 'tableHeader' }, snapshot.headquarters || 'N/A'],
          [{ text: 'Tech Maturity', style: 'tableHeader' }, snapshot.techMaturity || 'N/A'],
        ]
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 15]
    };
    content.push(snapshotTable);

    if (snapshot.techMaturityNote) {
      content.push({
        text: snapshot.techMaturityNote,
        style: 'note',
        margin: [0, 0, 0, 20]
      });
    }
  }

  // Company profile basics
  if (companyProfile.basics?.description) {
    content.push({
      text: 'About',
      style: 'subHeader',
      margin: [0, 10, 0, 5]
    });
    content.push({
      text: companyProfile.basics.description,
      margin: [0, 0, 0, 20]
    });
  }
  content.push({ text: '', pageBreak: 'after' });

  // ===== TOP OPPORTUNITIES =====
  content.push({
    text: '3. Top Opportunities',
    style: 'sectionHeader',
    margin: [0, 0, 0, 15]
  });

  // Top Opportunity (from cheatSheet)
  if (cheatSheet.topOpportunity) {
    const top = cheatSheet.topOpportunity;
    content.push({
      text: `#1: ${top.title}`,
      style: 'opportunityTitle',
      margin: [0, 0, 0, 10]
    });
    content.push({
      text: `Category: ${top.category || 'General'}`,
      style: 'category',
      margin: [0, 0, 0, 10]
    });

    if (top.problemSummary) {
      content.push({
        text: 'The Problem:',
        style: 'label',
        margin: [0, 0, 0, 3]
      });
      content.push({
        text: top.problemSummary,
        margin: [0, 0, 0, 10]
      });
    }

    if (top.whatWeBuild) {
      content.push({
        text: 'Proposed Solution:',
        style: 'label',
        margin: [0, 0, 0, 3]
      });
      content.push({
        text: top.whatWeBuild,
        margin: [0, 0, 0, 10]
      });
    }

    if (top.impact) {
      content.push({
        text: 'Expected Impact:',
        style: 'label',
        margin: [0, 0, 0, 3]
      });
      content.push({
        text: top.impact,
        style: 'impact',
        margin: [0, 0, 0, 10]
      });
    }

    if (top.evidence?.length > 0) {
      content.push({
        text: 'Supporting Evidence:',
        style: 'label',
        margin: [0, 0, 0, 3]
      });
      content.push({
        ul: top.evidence,
        margin: [0, 0, 0, 15]
      });
    }
  }

  // Backup opportunities
  if (cheatSheet.backupOpportunity1) {
    content.push({
      text: `Backup #1: ${cheatSheet.backupOpportunity1.title}`,
      style: 'subHeader',
      margin: [0, 15, 0, 5]
    });
    if (cheatSheet.backupOpportunity1.keyEvidence) {
      content.push({
        text: `Evidence: ${cheatSheet.backupOpportunity1.keyEvidence}`,
        margin: [0, 0, 0, 10]
      });
    }
  }

  if (cheatSheet.backupOpportunity2) {
    content.push({
      text: `Backup #2: ${cheatSheet.backupOpportunity2.title}`,
      style: 'subHeader',
      margin: [0, 15, 0, 5]
    });
    if (cheatSheet.backupOpportunity2.keyEvidence) {
      content.push({
        text: `Evidence: ${cheatSheet.backupOpportunity2.keyEvidence}`,
        margin: [0, 0, 0, 10]
      });
    }
  }
  content.push({ text: '', pageBreak: 'after' });

  // ===== COMPETITIVE ANALYSIS =====
  content.push({
    text: '4. Competitive Analysis',
    style: 'sectionHeader',
    margin: [0, 0, 0, 15]
  });

  if (competitiveAnalysis.overview) {
    content.push({
      text: competitiveAnalysis.overview,
      margin: [0, 0, 0, 20]
    });
  }

  // SWOT Analysis
  if (competitiveAnalysis.swot) {
    content.push({
      text: 'SWOT Analysis',
      style: 'subHeader',
      margin: [0, 10, 0, 10]
    });

    const swot = competitiveAnalysis.swot;
    const swotTable = {
      table: {
        widths: ['50%', '50%'],
        body: [
          [
            { text: 'STRENGTHS', style: 'swotHeader', fillColor: '#e8f5e9' },
            { text: 'WEAKNESSES', style: 'swotHeader', fillColor: '#ffebee' }
          ],
          [
            { ul: swot.strengths?.slice(0, 4) || ['N/A'], margin: [5, 5, 5, 5] },
            { ul: swot.weaknesses?.slice(0, 4) || ['N/A'], margin: [5, 5, 5, 5] }
          ],
          [
            { text: 'OPPORTUNITIES', style: 'swotHeader', fillColor: '#e3f2fd' },
            { text: 'THREATS', style: 'swotHeader', fillColor: '#fff3e0' }
          ],
          [
            { ul: swot.opportunities?.slice(0, 4) || ['N/A'], margin: [5, 5, 5, 5] },
            { ul: swot.threats?.slice(0, 4) || ['N/A'], margin: [5, 5, 5, 5] }
          ]
        ]
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 20]
    };
    content.push(swotTable);
  }

  // Competitor Matrix
  if (competitiveAnalysis.matrix?.length > 0) {
    content.push({
      text: 'Key Competitors',
      style: 'subHeader',
      margin: [0, 10, 0, 10]
    });

    competitiveAnalysis.matrix.slice(0, 5).forEach((comp, idx) => {
      content.push({
        text: `${idx + 1}. ${comp.competitorName}`,
        style: 'competitorName',
        margin: [0, 10, 0, 5]
      });
      if (comp.marketPosition) {
        content.push({
          text: comp.marketPosition,
          style: 'note',
          margin: [0, 0, 0, 5]
        });
      }
      if (comp.strengths?.length > 0) {
        content.push({
          text: 'Strengths: ' + comp.strengths.slice(0, 3).join(', '),
          fontSize: 9,
          margin: [0, 0, 0, 3]
        });
      }
      if (comp.weaknesses?.length > 0) {
        content.push({
          text: 'Weaknesses: ' + comp.weaknesses.slice(0, 3).join(', '),
          fontSize: 9,
          margin: [0, 0, 0, 3]
        });
      }
    });
  }
  content.push({ text: '', pageBreak: 'after' });

  // ===== CONVERSATION HOOKS & OBJECTION HANDLERS =====
  content.push({
    text: '5. Conversation Toolkit',
    style: 'sectionHeader',
    margin: [0, 0, 0, 15]
  });

  // Opening Hook
  if (cheatSheet.topOpportunity?.hook) {
    content.push({
      text: 'Conversation Opener',
      style: 'subHeader',
      margin: [0, 0, 0, 10]
    });
    const hookText = typeof cheatSheet.topOpportunity.hook === 'string'
      ? cheatSheet.topOpportunity.hook
      : cheatSheet.topOpportunity.hook.opener;
    content.push({
      text: `"${hookText}"`,
      style: 'quote',
      margin: [20, 0, 20, 15]
    });
  }

  // Stats for conversation
  if (cheatSheet.statsForConversation?.length > 0) {
    content.push({
      text: 'Stats to Drop in Conversation',
      style: 'subHeader',
      margin: [0, 10, 0, 10]
    });
    cheatSheet.statsForConversation.forEach(stat => {
      content.push({
        text: stat.stat,
        style: 'statHighlight',
        margin: [0, 5, 0, 2]
      });
      content.push({
        text: `Source: ${stat.source}`,
        style: 'note',
        margin: [0, 0, 0, 10]
      });
    });
  }

  // Objection Handlers
  if (cheatSheet.objectionHandlers?.length > 0) {
    content.push({
      text: 'Objection Handlers',
      style: 'subHeader',
      margin: [0, 15, 0, 10]
    });
    cheatSheet.objectionHandlers.forEach((handler, idx) => {
      content.push({
        text: `Objection: "${handler.objection}"`,
        style: 'objection',
        margin: [0, 5, 0, 3]
      });
      content.push({
        text: `Response: ${handler.response}`,
        margin: [0, 0, 0, 10]
      });
    });
  }

  // Why Us / Differentiation
  if (cheatSheet.differentiationPitch) {
    content.push({
      text: 'Why Us',
      style: 'subHeader',
      margin: [0, 15, 0, 10]
    });
    content.push({
      text: cheatSheet.differentiationPitch.whyUs,
      margin: [0, 0, 0, 10]
    });
    if (cheatSheet.differentiationPitch.threeOptions) {
      content.push({
        text: 'Three Options Framework:',
        style: 'label',
        margin: [0, 5, 0, 3]
      });
      content.push({
        text: cheatSheet.differentiationPitch.threeOptions,
        style: 'note',
        margin: [0, 0, 0, 10]
      });
    }
  }

  // Do Not Mention
  if (cheatSheet.doNotMention?.length > 0) {
    content.push({
      text: 'Topics to Avoid',
      style: 'subHeader',
      color: '#c62828',
      margin: [0, 15, 0, 10]
    });
    content.push({
      ul: cheatSheet.doNotMention,
      color: '#c62828',
      margin: [0, 0, 0, 15]
    });
  }
  content.push({ text: '', pageBreak: 'after' });

  // ===== DETAILED OPPORTUNITIES =====
  if (opportunities.length > 0) {
    content.push({
      text: '6. Detailed Opportunities',
      style: 'sectionHeader',
      margin: [0, 0, 0, 15]
    });

    opportunities.forEach((opp, idx) => {
      content.push({
        text: `${opp.rank || idx + 1}. ${opp.title}`,
        style: 'opportunityTitle',
        margin: [0, 10, 0, 5]
      });

      const oppDetails = [];
      if (opp.category) oppDetails.push(['Category', opp.category]);
      if (opp.evidenceStrength?.score) oppDetails.push(['Evidence Score', `${opp.evidenceStrength.score}/5`]);

      if (oppDetails.length > 0) {
        content.push({
          table: {
            widths: ['30%', '70%'],
            body: oppDetails
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 10]
        });
      }

      if (opp.problem?.description) {
        content.push({
          text: 'Problem:',
          style: 'label',
          margin: [0, 5, 0, 2]
        });
        content.push({
          text: opp.problem.description,
          margin: [0, 0, 0, 10]
        });
      }

      if (opp.conversationHook) {
        content.push({
          text: 'Conversation Hook:',
          style: 'label',
          margin: [0, 5, 0, 2]
        });
        const hookContent = typeof opp.conversationHook === 'string'
          ? opp.conversationHook
          : opp.conversationHook.openingQuestion || JSON.stringify(opp.conversationHook);
        content.push({
          text: `"${hookContent}"`,
          style: 'quote',
          margin: [10, 0, 10, 10]
        });
      }

      if (opp.proposedSolution) {
        content.push({
          text: 'Proposed Solution:',
          style: 'label',
          margin: [0, 5, 0, 2]
        });
        content.push({
          text: opp.proposedSolution,
          margin: [0, 0, 0, 10]
        });
      }

      if (opp.expectedOutcome) {
        content.push({
          text: 'Expected Outcome:',
          style: 'label',
          margin: [0, 5, 0, 2]
        });
        content.push({
          text: opp.expectedOutcome,
          style: 'impact',
          margin: [0, 0, 0, 10]
        });
      }

      if (opp.evidence?.length > 0) {
        content.push({
          text: 'Evidence:',
          style: 'label',
          margin: [0, 5, 0, 2]
        });
        content.push({
          ul: opp.evidence,
          margin: [0, 0, 0, 15]
        });
      }

      // Add separator between opportunities
      if (idx < opportunities.length - 1) {
        content.push({
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }],
          margin: [0, 10, 0, 10]
        });
      }
    });
  }

  // ===== FOOTER =====
  content.push({ text: '', pageBreak: 'after' });
  content.push({
    text: 'Report Generated by Aurora',
    style: 'footer',
    alignment: 'center',
    margin: [0, 200, 0, 10]
  });
  content.push({
    text: 'www.runaurora.com',
    style: 'footerLink',
    alignment: 'center'
  });
  content.push({
    text: `Analysis ID: ${analysis.id}`,
    style: 'footerId',
    alignment: 'center',
    margin: [0, 20, 0, 0]
  });

  // Document definition
  const docDefinition = {
    content,
    defaultStyle: {
      font: 'Helvetica',
      fontSize: 10,
      lineHeight: 1.3
    },
    styles: {
      brand: {
        fontSize: 36,
        bold: true,
        color: '#1e88e5'
      },
      subtitle: {
        fontSize: 18,
        color: '#666666'
      },
      companyTitle: {
        fontSize: 28,
        bold: true,
        color: '#333333'
      },
      domain: {
        fontSize: 14,
        color: '#888888'
      },
      date: {
        fontSize: 12,
        color: '#999999'
      },
      sectionHeader: {
        fontSize: 18,
        bold: true,
        color: '#1e88e5'
      },
      subHeader: {
        fontSize: 14,
        bold: true,
        color: '#333333'
      },
      opportunityTitle: {
        fontSize: 14,
        bold: true,
        color: '#2e7d32'
      },
      competitorName: {
        fontSize: 12,
        bold: true,
        color: '#1565c0'
      },
      highlight: {
        fontSize: 12,
        italics: true,
        color: '#555555'
      },
      label: {
        fontSize: 10,
        bold: true,
        color: '#555555'
      },
      category: {
        fontSize: 10,
        color: '#666666',
        italics: true
      },
      note: {
        fontSize: 9,
        color: '#777777',
        italics: true
      },
      impact: {
        fontSize: 11,
        color: '#2e7d32',
        bold: true
      },
      quote: {
        fontSize: 11,
        italics: true,
        color: '#1565c0'
      },
      objection: {
        fontSize: 10,
        color: '#c62828',
        italics: true
      },
      statHighlight: {
        fontSize: 12,
        bold: true,
        color: '#1565c0'
      },
      tableHeader: {
        bold: true,
        fillColor: '#f5f5f5'
      },
      swotHeader: {
        fontSize: 10,
        bold: true,
        alignment: 'center'
      },
      toc: {
        fontSize: 12,
        lineHeight: 1.8
      },
      footer: {
        fontSize: 14,
        color: '#1e88e5'
      },
      footerLink: {
        fontSize: 12,
        color: '#666666'
      },
      footerId: {
        fontSize: 8,
        color: '#999999'
      }
    },
    pageSize: 'LETTER',
    pageMargins: [50, 50, 50, 50],
    info: {
      title: `Aurora Report - ${companyName}`,
      author: 'Aurora Sales Intelligence',
      subject: `Sales intelligence report for ${companyName}`,
      creator: 'Aurora'
    }
  };

  return printer.createPdfKitDocument(docDefinition);
}
