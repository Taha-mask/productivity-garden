# Preliminary evidence review — MVP 0.2

Date: 2026-10-22. Status: preliminary, targeted review, not a systematic review. Product scope approved; engineering plan awaits review. No clinical or product efficacy claim is justified.

## Question and method

Does reducing decisions before starting one chosen task make starting easier without increasing app-related pressure? This precise garden interaction is an **unvalidated design hypothesis**. Research on planning, autonomy and learning informs its design but does not directly establish its effectiveness for Taha. Sources were checked through publisher, university, PubMed, WHO and NICE pages; some full-text endpoints were unavailable. No exhaustive search, formal quality grading or newest-review claim is made. No personal reflections or health data were sent to research services.

Evidence labels describe transfer to a feature, not a universal study-quality score: DIRECT EVIDENCE means research on that feature in a sufficiently similar context; INDIRECT EVIDENCE means a related intervention or population; THEORY-INFORMED means a theoretical rationale; DESIGN HYPOTHESIS means a proposed interaction needing testing; UNSUPPORTED means no adequate support identified. None of our product features currently qualifies as DIRECT EVIDENCE.

## Verified references and limits

| ID | Reference | Relevant finding and evidence type | Transfer limits and misuse risk |
|---|---|---|---|
| R1 | Gollwitzer, P. M., & Sheeran, P. (2006). *Implementation Intentions and Goal Achievement: A Meta-analysis of Effects and Processes*. Advances in Experimental Social Psychology, 38, 69–119. [DOI](https://doi.org/10.1016/S0065-2601%2806%2938002-1); [university record](https://www.socmot.uni-konstanz.de/publications/implementation-intentions-and-goal-achievement-meta-analysis-effects-and-processes). | Synthesis supports specifying a cue and response for goal pursuit. Non-clinical behavioral research relevant to optional concrete starting plans. | An optional smallest step is not necessarily an If–Then plan. No inference that a single-priority garden reduces guilt. Mandatory planning could add friction. Publisher full text was not retrieved in this pass; metadata and scope were checked through records. |
| R2 | Toli, A., Webb, T. L., & Hardy, G. E. (2016; online 2015). *Does forming implementation intentions help people with mental health problems to achieve goals? A meta-analysis of experimental studies with clinical and analogue samples*. British Journal of Clinical Psychology, 55, 69–90. [DOI](https://doi.org/10.1111/bjc.12086); [PubMed](https://pubmed.ncbi.nlm.nih.gov/25965276/). | Reports improved goal attainment across included studies of If–Then planning. | Different populations and interventions; cannot infer diagnosis or personal effectiveness. The supplied PMID is this paper, **not R1**. |
| R3 | Ryan, R. M., & Deci, E. L. (2000). *Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being*. American Psychologist, 55, 68–78. [DOI](https://doi.org/10.1037/0003-066X.55.1.68); [PubMed](https://pubmed.ncbi.nlm.nih.gov/11392867/). | Framework emphasizes autonomy, competence and relatedness. | THEORY-INFORMED support for editable choices and non-controlling language, not proof of our UI. Rewards may feel controlling; do not assume all rewards undermine motivation. |
| R4 | Roediger, H. L., III, & Karpicke, J. D. (2006). *Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention*. Psychological Science, 17, 249–255. [DOI](https://doi.org/10.1111/j.1467-9280.2006.01693.x); [publisher](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/). | Primary experiments support retrieval for delayed retention in studied material. | Remembering prose is not independent Flutter proficiency. Later learning evidence should include application and explanation; never require an examination for every task or hobby. |
| R5 | World Health Organization (2020). *Doing What Matters in Times of Stress: An Illustrated Guide*. [WHO](https://www.who.int/publications/i/item/9789240003927). | Public-health guide offers practical stress-management skills, including values-oriented action and handling difficult thoughts. | Informs future optional content and humane language, not a treatment protocol implemented by this app. No automated ACT/CBT coaching is approved. |
| R6 | NICE (2022). *Depression in adults: treatment and management*, NG222. [Recommendations](https://www.nice.org.uk/guidance/ng222/chapter/Recommendations). | Clinical guideline includes structured behavioral activation and CBT with appropriate delivery/support. | Clinical evidence is for those interventions, not planting tasks or this user. Do not equate activity scheduling with delivering therapy or maximizing work. |
| R7 | Linardon, J., et al. (2024). *Systematic review and meta-analysis of adverse events in clinical trials of mental health apps*. npj Digital Medicine, 7, 363. [DOI](https://doi.org/10.1038/s41746-024-01388-y); [publisher](https://www.nature.com/articles/s41746-024-01388-y). | Adverse-event reporting was limited and heterogeneous; absence of reported harms cannot establish safety. | Does not show this productivity app causes harm. Use voluntary pressure feedback and stopping rules, not clinical risk scores. Full article was accessible in the previous preliminary pass; current endpoint retrieval failed. |

## Design implications, not efficacy claims

- One selected task, optional step and quiet secondary task access are DESIGN HYPOTHESES for reducing decision friction. Do not cite choice overload as an established explanation without relevant evidence.
- Keep existing garden and rewards unchanged in 0.2; do not expand randomness, notifications or scarcity. Collect no engagement-maximization metric.
- Mood tracking, Reality Check, If–Then scheduling, recovery automation and learning verification are deferred. Optionality alone does not establish safety.
- Digital boundaries and gamification harms need a separate focused review before implementation. No dedicated review of Discord-specific boundaries or reward compulsion was completed here. ACT and self-regulated learning coverage is contextual and incomplete.
- Preference: Taha wants a peaceful garden, Flutter learning, creative activity and rest without penalties. These are product requirements, not scientific results.

## Pending sources

Angela Yu's *Achieve More Workbook* and *Prompt Engineering: The Complete Guide* are unavailable. No exercises or claims are attributed to them. They are not required to ship or evaluate this MVP and would not count as clinical guidelines if supplied.

## Next research gate

Do not turn this preliminary review into an open-ended research project. Run the narrow usability experiment first after engineering approval. Expand research only for a feature actually selected later. Keep factual changes to references distinct from product-design approval.
