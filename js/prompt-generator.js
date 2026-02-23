// prompt-generator.js — ES Module (deferred, DOM is ready when this runs)
// Note: theme is managed independently here because it integrates with
// Mermaid re-initialization on toggle.

// Color themes
const colorThemes = {
    modern: {
        primary: '#4263EB',
        secondary: '#12B981',
        accent: '#F97316'
    },
    classic: {
        primary: '#8B5A2B',
        secondary: '#D4AF37',
        accent: '#7D3C3C'
    },
    vivid: {
        primary: '#FF3366',
        secondary: '#33CCFF',
        accent: '#FFCC00'
    },
    monochrome: {
        primary: '#333333',
        secondary: '#666666',
        accent: '#999999'
    },
    pastel: {
        primary: '#FFAAA7',
        secondary: '#A8E6CF',
        accent: '#FFD3B6'
    },
    corporate: {
        primary: '#0A2463',
        secondary: '#3E92CC',
        accent: '#D8315B'
    }
};

// App state
let state = {
    selectedTags: [],
    selectedConcept: 'neumorphism',
    selectedColorOption: 'theme',
    selectedTheme: 'modern',
    activeTab: 'infographic',
    primaryColor: '#4263EB',
    secondaryColor: '#12B981',
    accentColor: '#F97316'
};

// DOM Elements
const themeToggle      = document.getElementById('theme-toggle');
const colorOptions     = document.querySelectorAll('.color-option-btn');
const themeSelector    = document.getElementById('theme-selector');
const customColors     = document.getElementById('custom-colors');
const themeItems       = document.querySelectorAll('.color-theme');
const focusTags        = document.querySelectorAll('#focus-tags .tag');
const conceptCards     = document.querySelectorAll('.concept-card');
const tabs             = document.querySelectorAll('.tab');
const generateBtn      = document.getElementById('generate-btn');
const result           = document.getElementById('result');
const copyBtn          = document.getElementById('copy-btn');
const copyStatus       = document.getElementById('copy-status');
const toast            = document.getElementById('toast');
const infographicPreview = document.getElementById('infographic-preview');
const recordingPreview   = document.getElementById('recording-preview');
const infographicStyle   = document.getElementById('infographic-style');
const recordingStyle     = document.getElementById('recording-style');

// Check badge helper: insert/remove Font Awesome check icon
function setCheckBadge(el, show, small = false) {
    const existing = el.querySelector('.check-badge, .check-badge-sm');
    if (show && !existing) {
        const icon = document.createElement('i');
        icon.className = `fas fa-check ${small ? 'check-badge-sm' : 'check-badge'}`;
        icon.setAttribute('aria-hidden', 'true');
        el.appendChild(icon);
    } else if (!show && existing) {
        existing.remove();
    }
}

// Roving tabindex utility for radiogroup keyboard navigation
function makeRoving(items) {
    items.forEach((item, i) => {
        const isChecked = item.getAttribute('aria-checked') === 'true';
        item.setAttribute('tabindex', isChecked ? '0' : '-1');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const next = items[(i + 1) % items.length];
                items.forEach(t => t.setAttribute('tabindex', '-1'));
                next.setAttribute('tabindex', '0');
                next.focus();
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = items[(i - 1 + items.length) % items.length];
                items.forEach(t => t.setAttribute('tabindex', '-1'));
                prev.setAttribute('tabindex', '0');
                prev.focus();
            }
        });
    });
}

// Theme toggle (prompt-generator has custom applyTheme that re-initializes Mermaid)
const themeIcon = themeToggle.querySelector('i');

function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    themeIcon.classList.toggle('fa-sun', isDark);
    themeIcon.classList.toggle('fa-moon', !isDark);
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'var(--font-sans)'
    });
    updateMermaidPreviews();
}

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Color option toggle
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        colorOptions.forEach(opt => {
            opt.classList.remove('active');
            opt.setAttribute('aria-pressed', 'false');
        });
        option.classList.add('active');
        option.setAttribute('aria-pressed', 'true');

        state.selectedColorOption = option.dataset.option;

        if (state.selectedColorOption === 'theme') {
            themeSelector.classList.remove('hidden');
            customColors.classList.add('hidden');

            // Update colors from theme
            updateColorsFromTheme(state.selectedTheme);
        } else {
            themeSelector.classList.add('hidden');
            customColors.classList.remove('hidden');

            // Update colors from custom inputs
            state.primaryColor = document.getElementById('primary-color').value;
            state.secondaryColor = document.getElementById('secondary-color').value;
            state.accentColor = document.getElementById('accent-color').value;
        }

        updateMermaidPreviews();
        saveFormState();
    });
});

// Theme selection
themeItems.forEach(theme => {
    theme.addEventListener('click', () => {
        themeItems.forEach(t => {
            t.classList.remove('selected');
            t.setAttribute('aria-checked', 'false');
            t.setAttribute('tabindex', '-1');
            setCheckBadge(t, false, true);
        });
        theme.classList.add('selected');
        theme.setAttribute('aria-checked', 'true');
        theme.setAttribute('tabindex', '0');
        setCheckBadge(theme, true, true);

        state.selectedTheme = theme.dataset.theme;
        updateColorsFromTheme(state.selectedTheme);
        updateMermaidPreviews();
        saveFormState();
    });
    theme.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            theme.click();
        }
    });
});
makeRoving(Array.from(themeItems));

// Update colors from theme
function updateColorsFromTheme(themeName) {
    const theme = colorThemes[themeName];
    if (theme) {
        state.primaryColor = theme.primary;
        state.secondaryColor = theme.secondary;
        state.accentColor = theme.accent;

        // Update custom color inputs as well
        document.getElementById('primary-color').value = theme.primary;
        document.getElementById('secondary-color').value = theme.secondary;
        document.getElementById('accent-color').value = theme.accent;
    }
}

// Custom color inputs
document.getElementById('primary-color').addEventListener('input', (e) => {
    state.primaryColor = e.target.value;
    updateMermaidPreviews();
    saveFormState();
});

document.getElementById('secondary-color').addEventListener('input', (e) => {
    state.secondaryColor = e.target.value;
    updateMermaidPreviews();
    saveFormState();
});

document.getElementById('accent-color').addEventListener('input', (e) => {
    state.accentColor = e.target.value;
    updateMermaidPreviews();
    saveFormState();
});

// Focus tags
focusTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
        const tagId = tag.dataset.tag;
        const isSelected = tag.classList.contains('selected');
        tag.setAttribute('aria-checked', isSelected ? 'true' : 'false');

        if (isSelected) {
            if (!state.selectedTags.includes(tagId)) {
                state.selectedTags.push(tagId);
            }
        } else {
            state.selectedTags = state.selectedTags.filter(id => id !== tagId);
        }
        saveFormState();
    });
    tag.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tag.click();
        }
    });
});

// Concept cards
conceptCards.forEach(card => {
    card.addEventListener('click', () => {
        conceptCards.forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-checked', 'false');
            c.setAttribute('tabindex', '-1');
            setCheckBadge(c, false);
        });
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
        card.setAttribute('tabindex', '0');
        setCheckBadge(card, true);
        state.selectedConcept = card.dataset.concept;
        saveFormState();
    });
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});
makeRoving(Array.from(conceptCards));

// Tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');

        const tabId = tab.dataset.tab;
        state.activeTab = tabId;

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.getElementById(`${tabId}-tab`).classList.add('active');
        updateMermaidPreviews();
        saveFormState();
    });
    tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tab.click();
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const allTabs = Array.from(document.querySelectorAll('.tab'));
            const currentIndex = allTabs.indexOf(tab);
            let nextIndex;
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % allTabs.length;
            } else {
                nextIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
            }
            allTabs[nextIndex].focus();
            allTabs[nextIndex].click();
        }
    });
});

// Infographic and recording style changes
infographicStyle.addEventListener('change', updateMermaidPreviews);
recordingStyle.addEventListener('change', updateMermaidPreviews);

// Generate Mermaid diagram code
function getMermaidDiagram() {
    if (state.activeTab === 'infographic') {
        const style = infographicStyle.value;

        switch (style) {
            case 'comparative':
                return `graph LR
    A[Option A] --> C{Comparison}
    B[Option B] --> C
    C --> D[Pros/Cons]
    C --> E[Features]
    style A fill:${state.primaryColor},color:white
    style B fill:${state.secondaryColor},color:white
    style C fill:${state.accentColor},color:white`;
            case 'hierarchical':
                return `graph TD
    A[Main Concept] --> B[Sub-Concept 1]
    A --> C[Sub-Concept 2]
    A --> D[Sub-Concept 3]
    B --> E[Detail 1.1]
    B --> F[Detail 1.2]
    style A fill:${state.primaryColor},color:white
    style B fill:${state.secondaryColor},color:white
    style C fill:${state.secondaryColor},color:white
    style D fill:${state.secondaryColor},color:white`;
            case 'process':
                return `graph LR
    A[Start] --> B[Process 1]
    B --> C[Process 2]
    C --> D[Process 3]
    D --> E[End]
    style A fill:${state.primaryColor},color:white
    style E fill:${state.accentColor},color:white`;
            case 'statistical':
                return `pie
    title Key Distribution
    "Category A" : 25
    "Category B" : 40
    "Category C" : 35`;
            case 'conceptual':
                return `graph TD
    A[Central Concept] --- B[Related Concept 1]
    A --- C[Related Concept 2]
    A --- D[Related Concept 3]
    B --- E[Sub-concept 1.1]
    C --- F[Sub-concept 2.1]
    style A fill:${state.primaryColor},color:white`;
            default:
                return `graph TD
    A[Concept] --> B[Details]`;
        }
    } else {
        const style = recordingStyle.value;

        switch (style) {
            case 'timeline':
                return `gantt
    title Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Task 1 :a1, 2023-01-01, 30d
    Task 2 :a2, after a1, 20d
    section Phase 2
    Task 3 :a3, after a2, 25d
    Task 4 :a4, after a3, 15d`;
            case 'mindmap':
                return `mindmap
    root((Central Topic))
      Idea 1
        Sub-idea 1.1
        Sub-idea 1.2
      Idea 2
        Sub-idea 2.1
      Idea 3
        Sub-idea 3.1
        Sub-idea 3.2`;
            case 'journey':
                return `graph LR
    A[Starting Point] --> B[Checkpoint 1]
    B --> C[Checkpoint 2]
    C --> D[Checkpoint 3]
    D --> E[Destination]
    style A fill:${state.primaryColor},color:white
    style E fill:${state.accentColor},color:white`;
            case 'quadrant':
                return `quadrantChart
    title Quadrant Chart
    x-axis Low Impact --> High Impact
    y-axis Low Effort --> High Effort
    quadrant-1 Strategic
    quadrant-2 Quick Wins
    quadrant-3 Time Sinks
    quadrant-4 Thankless Tasks
    Item 1: [0.6, 0.7]
    Item 2: [0.4, 0.3]
    Item 3: [0.8, 0.2]
    Item 4: [0.2, 0.8]`;
            case 'modal':
                return `graph TD
    A[Start] --> B{Decision Point}
    B -->|Option 1| C[Outcome 1]
    B -->|Option 2| D[Outcome 2]
    B -->|Option 3| E[Outcome 3]
    style B fill:${state.accentColor},color:white`;
            default:
                return `graph TD
    A[Start] --> B[End]`;
        }
    }
}

// Update Mermaid previews
function updateMermaidPreviews() {
    const mermaidCode = getMermaidDiagram();
    const container = state.activeTab === 'infographic' ? infographicPreview : recordingPreview;

    try {
        // Clear previous content
        container.innerHTML = '';

        // Render Mermaid diagram
        mermaid.render(`mermaid-${Date.now()}`, mermaidCode)
            .then(result => {
                container.innerHTML = result.svg;
            })
            .catch(error => {
                container.innerHTML = `
                    <div style="color: var(--accent-color); padding: 1rem; background-color: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.5rem;">
                        Error: Failed to render diagram
                    </div>
                    <pre style="margin-top: 1rem; padding: 1rem; background-color: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.5rem; overflow-x: auto; color: var(--text-primary);">${mermaidCode}</pre>
                `;
                console.error('Mermaid rendering error:', error);
            });
    } catch (error) {
        container.innerHTML = `
            <div style="color: var(--accent-color); padding: 1rem; background-color: var(--surface-color); border-radius: 0.5rem;">
                Error: Failed to render diagram
            </div>
            <pre style="margin-top: 1rem; padding: 1rem; background-color: var(--bg-color); border-radius: 0.5rem; overflow-x: auto; color: var(--text-primary);">${mermaidCode}</pre>
        `;
        console.error('Mermaid rendering error:', error);
    }
}

// Generate prompt
generateBtn.addEventListener('click', () => {
    const topic = document.getElementById('topic').value.trim();
    const contentDescription = document.getElementById('content-description').value.trim();
    const fontStyle = document.getElementById('font-style').value;
    const outputFormat = document.getElementById('output-format').value;
    const outputLanguage = document.getElementById('output-language').value;

    if (!topic || !contentDescription) {
        showToast('Main theme and detailed description are required fields');
        return;
    }

    // Get selected focus tags text
    const selectedTagLabels = Array.from(document.querySelectorAll('#focus-tags .tag.selected'))
        .map(tag => tag.textContent)
        .join(', ');

    // Font style settings
    let fontFamily = '';
    switch (fontStyle) {
        case 'modern':
            fontFamily = 'Inter, system-ui, sans-serif';
            break;
        case 'classic':
            fontFamily = 'Georgia, serif';
            break;
        case 'creative':
            fontFamily = 'Montserrat, Avenir, sans-serif';
            break;
        case 'minimal':
            fontFamily = 'SF Mono, Consolas, monospace';
            break;
    }

    // Infographic style settings
    let infographicDesc = '';
    if (state.activeTab === 'infographic') {
        switch (infographicStyle.value) {
            case 'comparative':
                infographicDesc = 'Use comparative analysis techniques to visually contrast different data points and highlight key differences.';
                break;
            case 'hierarchical':
                infographicDesc = 'Implement a clear hierarchical structure to show the relative importance of information through size, position, and visual weight.';
                break;
            case 'process':
                infographicDesc = 'Create a step-by-step flow visualization that clearly shows progression through stages and relationships between steps.';
                break;
            case 'statistical':
                infographicDesc = 'Utilize statistical visualization techniques like charts, graphs, and data representation to clearly communicate numerical information.';
                break;
            case 'conceptual':
                infographicDesc = 'Develop conceptual diagrams that illustrate relationships between ideas, showing connections and influences between different elements.';
                break;
        }
    }

    // Graphic recording style settings
    let recordingDesc = '';
    if (state.activeTab === 'recording') {
        switch (recordingStyle.value) {
            case 'timeline':
                recordingDesc = 'Use timeline-based visualization to show temporal progression and development of concepts over time.';
                break;
            case 'mindmap':
                recordingDesc = 'Implement a radial mind-mapping approach to show how concepts relate to a central theme and branch out into sub-topics.';
                break;
            case 'journey':
                recordingDesc = 'Create a journey-map style visual that depicts experiences, touchpoints, and emotional states through a process.';
                break;
            case 'quadrant':
                recordingDesc = 'Organize information into a quadrant-based system using two axes to create four distinct categories or zones.';
                break;
            case 'modal':
                recordingDesc = 'Apply modal logic visualization to distinguish between necessities, possibilities, and contingencies in the content.';
                break;
        }
    }

    // Design concept specific styles and settings
    let designStyle = '';
    let colorApproach = '';
    let interactions = '';

    switch (state.selectedConcept) {
        case 'neumorphism':
            designStyle = 'Implement a Fluid Neumorphism design with soft shadows and subtle 3D effects for a tactile, premium feel.';
            colorApproach = `Use a light neutral background (#F0F2F9) with ${state.primaryColor} as the primary accent, ${state.secondaryColor} as the secondary accent, and ${state.accentColor} as tertiary accent. Apply soft shadows to create depth.`;
            interactions = 'Create subtle animations for interactive elements that provide feedback through a pressed/elevated feel.';
            break;
        case 'colorscape':
            designStyle = 'Apply a Dynamic Colorscape design with vibrant colors, gradients, and spatial depth to create visual energy.';
            colorApproach = `Use gradients combining ${state.primaryColor} with complementary colors. Add ${state.secondaryColor} as a contrasting accent and ${state.accentColor} for highlights. Maintain a clean white (#FFFFFF) background to make colors pop.`;
            interactions = 'Implement energetic feedback through color shifts, scaling effects, and smooth transitions on interactive elements.';
            break;
        case 'typographic':
            designStyle = 'Create a Typographic Grid design focusing on typography, whitespace, and structural layout for clarity and focus.';
            colorApproach = `Utilize a limited color palette with ${state.primaryColor} as the primary accent, ${state.secondaryColor} as a minimal secondary accent, and ${state.accentColor} used sparingly for highlights. Maintain high contrast with clean backgrounds.`;
            interactions = 'Keep interactions subtle and focused on readability, with minimal animations and clear state changes.';
            break;
    }

    // Output format specific instructions with enhanced Mermaid support
    let formatInstructions = '';
    switch (outputFormat) {
        case 'mermaid':
            formatInstructions = `
## Output Format: Mermaid Diagram
- Create a diagram that fits well within a card-style UI component (ideal dimensions: 600px width, 400px height)
- Use Mermaid syntax to create clear, concise diagrams with proper node spacing
- Use ${state.primaryColor} for primary elements, ${state.secondaryColor} for secondary elements, and ${state.accentColor} for highlights
- Keep labels brief and focused - aim for 1-3 words per node where possible
- Ensure the diagram is not too dense - 5-15 nodes is optimal for readability
- Add styling to nodes for better visual hierarchy
- Use the following recommended Mermaid diagram type: ${state.activeTab === 'infographic' ?
                (infographicStyle.value === 'process' ? 'flowchart LR (left-to-right flowchart)' :
                infographicStyle.value === 'hierarchical' ? 'flowchart TD (top-down flowchart)' :
                infographicStyle.value === 'statistical' ? 'pie chart or bar chart' :
                infographicStyle.value === 'comparative' ? 'flowchart LR with comparisons' :
                'flowchart TD with relationship links') :
                (recordingStyle.value === 'timeline' ? 'gantt or timeline' :
                recordingStyle.value === 'mindmap' ? 'mindmap' :
                recordingStyle.value === 'journey' ? 'flowchart LR with journey points' :
                recordingStyle.value === 'quadrant' ? 'quadrant chart' :
                'flowchart TD with decision points')}
- Example diagram structure based on selected style:

\`\`\`mermaid
${getMermaidDiagram()}
\`\`\``;
            break;
        case 'html':
            formatInstructions = `
## Output Format: HTML with Embedded Mermaid
- Create a valid HTML5 document with proper semantic structure
- Use CSS for styling, preferably with CSS variables for color themes
- Include Mermaid.js library (version 10.6.1 or newer) to render diagrams
- Structure the content in card-based components with responsive design
- Use the following Mermaid diagram in a "mermaid" class div:

\`\`\`mermaid
${getMermaidDiagram()}
\`\`\``;
            break;
        case 'markdown':
            formatInstructions = `
## Output Format: Markdown with Mermaid
- Use standard Markdown syntax for consistent rendering across platforms
- Include Mermaid diagram code blocks for visualization
- Structure content with clear hierarchy and card-like sections
- Keep diagram dimensions appropriate for card UI components
- Example Mermaid diagram to include:

\`\`\`mermaid
${getMermaidDiagram()}
\`\`\``;
            break;
        case 'markdown-plain':
            formatInstructions = `
## Output Format: Markdown (Plain)
- Use clean, standard Markdown syntax for consistent rendering across platforms
- Create a well-structured document with proper heading hierarchy (h1, h2, h3)
- Utilize lists, tables, blockquotes, and code blocks appropriately
- Include emphasis and strong formatting for key concepts
- Create clear section divisions with horizontal rules where appropriate
- Use links to connect related concepts within the document
- Structure content for optimal readability with appropriate whitespace
- Focus on creating a document that's easy to navigate and scan`;
            break;
        case 'react':
            formatInstructions = `
## Output Format: React Component with Mermaid
- Create a functional React component that renders a card-based UI
- Use a Mermaid rendering library like mermaid-react
- Implement styled components for consistent visual styling
- Ensure responsive design for different viewport sizes
- Include the following Mermaid diagram definition:

\`\`\`jsx
const diagram = \`
${getMermaidDiagram()}
\`;
\`\`\``;
            break;
        default:
            formatInstructions = `
## Output Format: ${outputFormat}
- Include Mermaid diagrams where appropriate to illustrate concepts
- Maintain a card-based UI approach for content organization
- Ensure diagrams fit well within card containers without overflow
- Example diagram to incorporate:

\`\`\`mermaid
${getMermaidDiagram()}
\`\`\``;
    }

    // Language-specific instructions
    const languageOptions = {
        en: 'English',
        ja: 'Japanese',
        zh: 'Chinese',
        ko: 'Korean'
    };

    const langInstructions = outputLanguage !== 'en' ?
        `\n\n## Language\nOutput should be in ${languageOptions[outputLanguage]}.` : '';

    // Final prompt template generation
    const promptTemplate = `# Layout and Style Instructions for "${topic}"

Create a comprehensive explanation about ${topic} with the following design approach:

## Content Requirements
${contentDescription}

Focus especially on: ${selectedTagLabels || "Clear, detailed explanations"}

## Design Concept: ${state.selectedConcept === 'neumorphism' ? 'Fluid Neumorphism' : state.selectedConcept === 'colorscape' ? 'Dynamic Colorscape' : 'Typographic Grid'}
${designStyle}

## Visual Structure
- Create a clean, organized layout with card-based UI components
- Implement a compact header with in-page navigation links to major sections
- Ensure all diagrams fit properly within card containers without overflow
- Design for responsiveness and readability across different screen sizes

## Typography
- Use ${fontFamily} for consistent readability
- Apply a clear typographic hierarchy with distinct heading and body text styles
- Maintain optimal line length and spacing for comfortable reading
- Highlight key concepts using the accent text treatment

## Color Treatment
${colorApproach}

## Information Visualization
- ${infographicDesc}
- Ensure relationships between elements are visually clear through connecting lines and spatial organization
- Use color coding consistently to differentiate categories of information
- Add clear labels to explain relationships between connected elements

## Conceptual Mapping
- ${recordingDesc}
- Make temporal progression and logical relationships easy to understand through visual organization
- Use appropriate containers and connectors to show how concepts relate to each other
- Implement visual metaphors where appropriate to simplify complex ideas

## Interactive Considerations
${interactions}
${formatInstructions}${langInstructions}

Remember to prioritize clarity, readability, and information hierarchy throughout the entire explanation. All diagrams should fit well within card UI components for a clean, consistent presentation.`;

    // Set result with animation
    result.style.opacity = '0';
    setTimeout(() => {
        result.textContent = promptTemplate;
        result.style.opacity = '1';
    }, 300);
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(result.textContent)
        .then(() => {
            // Show copy status
            copyStatus.classList.add('visible');

            // Show toast
            toast.classList.add('active');

            setTimeout(() => {
                copyStatus.classList.remove('visible');
            }, 2000);

            setTimeout(() => {
                toast.classList.remove('active');
            }, 3000);
        })
        .catch(err => {
            console.error('Failed to copy to clipboard:', err);
            showToast('Copy failed. Please check clipboard permissions.');
        });
});

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Form state persistence
const FORM_STATE_KEY = 'promptGeneratorFormState';

function saveFormState() {
    const formState = {
        topic: document.getElementById('topic').value,
        description: document.getElementById('content-description').value,
        outputLanguage: document.getElementById('output-language').value,
        fontStyle: document.getElementById('font-style').value,
        outputFormat: document.getElementById('output-format').value,
        selectedTags: state.selectedTags,
        selectedConcept: state.selectedConcept,
        selectedColorOption: state.selectedColorOption,
        selectedTheme: state.selectedTheme,
        primaryColor: state.primaryColor,
        secondaryColor: state.secondaryColor,
        accentColor: state.accentColor,
        activeTab: state.activeTab,
        infographicStyle: document.getElementById('infographic-style').value,
        recordingStyle: document.getElementById('recording-style').value
    };
    localStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState));
}

function restoreFormState(saved) {
    if (saved.topic) document.getElementById('topic').value = saved.topic;
    if (saved.description) document.getElementById('content-description').value = saved.description;
    if (saved.outputLanguage) document.getElementById('output-language').value = saved.outputLanguage;
    if (saved.fontStyle) document.getElementById('font-style').value = saved.fontStyle;
    if (saved.outputFormat) document.getElementById('output-format').value = saved.outputFormat;
    if (saved.infographicStyle) document.getElementById('infographic-style').value = saved.infographicStyle;
    if (saved.recordingStyle) document.getElementById('recording-style').value = saved.recordingStyle;

    // Restore tags
    if (saved.selectedTags && saved.selectedTags.length) {
        state.selectedTags = saved.selectedTags;
        focusTags.forEach(tag => {
            const isSelected = state.selectedTags.includes(tag.dataset.tag);
            tag.classList.toggle('selected', isSelected);
            tag.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    }

    // Restore concept
    if (saved.selectedConcept) {
        state.selectedConcept = saved.selectedConcept;
        conceptCards.forEach(card => {
            const isSelected = card.dataset.concept === saved.selectedConcept;
            card.classList.toggle('selected', isSelected);
            card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
            setCheckBadge(card, isSelected);
        });
    }

    // Restore color option
    if (saved.selectedColorOption) {
        state.selectedColorOption = saved.selectedColorOption;
        colorOptions.forEach(opt => {
            const isActive = opt.dataset.option === saved.selectedColorOption;
            opt.classList.toggle('active', isActive);
            opt.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        if (saved.selectedColorOption === 'custom') {
            document.getElementById('theme-selector').classList.add('hidden');
            document.getElementById('custom-colors').classList.remove('hidden');
        }
    }

    // Restore theme
    if (saved.selectedTheme) {
        state.selectedTheme = saved.selectedTheme;
        themeItems.forEach(t => {
            const isSelected = t.dataset.theme === saved.selectedTheme;
            t.classList.toggle('selected', isSelected);
            t.setAttribute('aria-checked', isSelected ? 'true' : 'false');
            setCheckBadge(t, isSelected, true);
        });
    }

    // Restore colors
    if (saved.primaryColor) {
        state.primaryColor = saved.primaryColor;
        document.getElementById('primary-color').value = saved.primaryColor;
    }
    if (saved.secondaryColor) {
        state.secondaryColor = saved.secondaryColor;
        document.getElementById('secondary-color').value = saved.secondaryColor;
    }
    if (saved.accentColor) {
        state.accentColor = saved.accentColor;
        document.getElementById('accent-color').value = saved.accentColor;
    }

    // Restore active tab
    if (saved.activeTab) {
        state.activeTab = saved.activeTab;
        tabs.forEach(t => {
            const isActive = t.dataset.tab === saved.activeTab;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            t.setAttribute('tabindex', isActive ? '0' : '-1');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${saved.activeTab}-tab`);
        if (activeContent) activeContent.classList.add('active');
    }
}

// Attach save listeners
['topic', 'content-description', 'output-language', 'infographic-style', 'recording-style'].forEach(id => {
    document.getElementById(id).addEventListener('input', saveFormState);
    document.getElementById(id).addEventListener('change', saveFormState);
});

// ── Initialize (replaces DOMContentLoaded — module is already deferred) ──
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(storedTheme === 'dark' || (storedTheme === null && prefersDark));

// Set initial colors
updateColorsFromTheme('modern');

// Restore saved form state
const savedForm = localStorage.getItem(FORM_STATE_KEY);
if (savedForm) {
    try {
        restoreFormState(JSON.parse(savedForm));
    } catch (e) {
        localStorage.removeItem(FORM_STATE_KEY);
    }
}

// Initialize check badges for default selected elements
conceptCards.forEach(card => setCheckBadge(card, card.classList.contains('selected')));
themeItems.forEach(t => setCheckBadge(t, t.classList.contains('selected'), true));

// Initialize Mermaid previews
updateMermaidPreviews();
