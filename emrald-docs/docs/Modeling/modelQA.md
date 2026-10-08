# Methodology for Verification and Validation Support of Dynamic EMRALD Models

## Summary

Dynamic EMRALD models represent time-dependent interactions among equipment, system conditions, operator actions, recovery activities, and external simulations. This document presents a repeatable methodology for verifying and supporting the validation of these models. The methodology combines structural review of individual model objects with behavioral techniques including scenario-path tracing, minimum-combination, dependency, isolation, boundary, timing, stochastic, and regression testing. It was developed and demonstrated using a generic pressurized-water reactor model within the MASS-DEF framework. The methodology primarily provides verification evidence; site-specific validation requires additional independent evidence concerning the represented plant, procedures, equipment, operator actions, and analysis inputs.

## 1. Introduction

Dynamic risk models may support decisions that are reviewed by plant personnel, independent quality-assurance (QA) organizations, or regulators. A defensible analysis therefore requires a systematic record showing that the model was reviewed, its assumptions were identified, and its important behaviors were tested. EMRALD may be maintained under a software QA program, but software QA does not by itself establish the quality of a model created in that software. The model’s diagrams, data, logic, code, and connections must also be evaluated for the specific application.

The Modeling and Analysis for Safety and Security using Dynamic Evaluation Framework (MASS-DEF) uses Event Modeling Risk Assessment using Linked Diagrams (EMRALD) [1] to connect time-dependent information from physical-security simulations with operator actions, plant-system response, and thermal-hydraulic consequences. Conventional force-on-force analysis generally ends when adversaries successfully sabotage a target set and assumes that loss of the target set leads to core damage. MASS-DEF carries the analysis beyond sabotage by using equipment-damage timing to determine whether operator actions and backup equipment can prevent core damage [2]. In the generic pressurized-water reactor (PWR) application examined in this work, physical-security results were provided as scenario inputs, and thermal-hydraulic consequences were evaluated using a surrogate. Accurate results therefore depend on the consistent interpretation of these inputs and on the correct representation of event order, timing, dependencies, and State transitions. Errors in these areas can produce plausible but incorrect results.

A repeatable model-evaluation process is therefore needed to show both that the model was built correctly and that it adequately represents the system and scenarios for its intended use. Verification focuses on correct implementation of the specified logic and data. Validation focuses on whether the model is an adequate representation of the real system for the question being asked. The two activities overlap during review, but they rely on different forms of evidence and should not be treated as interchangeable.

The objective of this work was to develop and demonstrate a systematic EMRALD verification and validation methodology. The methodology was developed while reviewing and testing a generic PWR model used in the MASS-DEF framework. The generic model served as the application case through which review practices, test strategies, and documentation needs were identified. The resulting procedure is presented as a general reference that can be adapted to other EMRALD models, including plant-specific models, while recognizing that validation of a plant-specific application requires plant-specific evidence.

## 2. Model Verification and Validation Methodology

The methodology is applied as a progressive review and testing workflow. First, the reviewer establishes the review scope, Model configuration baseline, documentation records, and applicable roles and responsibilities. The Model’s intended use, requirements, assumptions, and acceptance criteria are then defined using appropriate technical evidence. Structural review proceeds from individual Model objects to Logic Trees, connections, and a Model-wide inventory. Based on the findings and relationships identified during the structural review, the reviewer plans and performs the applicable behavioral tests, including scenario-path tracing, minimum-combination, dependency, isolation, boundary, timing, stochastic, external-interface, and repeat-run testing. Findings are tracked in Jira through correction or formal disposition, together with any resulting Model changes. Corrected behavior is then retested, and the applicable regression baseline is rerun to identify unintended effects. Finally, review records, test results, Jira issues, output files, and technical bases are retained to provide traceability from each important Model requirement or assumption to its supporting evidence.

### 2.1 Reviewer Mindset and Review Preparation

The reviewer should approach the model with the expectation that important behaviors, dependencies, or assumptions may not yet be represented. The review should consider not only whether the existing logic works, but also whether the model includes everything necessary to represent the intended system or scenario. For example, the reviewer should determine whether a realistic time delay should occur before an Action is completed, whether an Action depends on the availability of another component, or whether a required dependency is missing from the logic. These observations are important even when they do not immediately indicate a model error; they may instead identify assumptions that must be documented or limitations that must be acknowledged.

This same caution applies once testing begins. The reviewer’s predicted outcome for any given test case should be treated as a hypothesis to be checked against the model, not as the standard the model must be forced to meet. When an actual result differs from what was expected, the reviewer should first trace the executed path to understand why. The difference may reveal a genuine model issue, but it may also reveal that the original prediction was incomplete or rested on a mistaken assumption about the model’s logic. In that case, the expected result should be corrected and its new basis documented, not the model.

Reviewers should become familiar with EMRALD’s search function and its [Debug](./solver.md#debug-file) and [Path Results](./solver.md#path-results) output files (see [Appendix B](#appendix-b-emrald-search-and-output-files)), since both are used throughout the review to confirm the model’s actual behavior.

For a formal QA review, the results should be documented in a review tracking spreadsheet. Each Diagram, State, Event, Action, Variable, Distribution, and External Simulation should be recorded and marked as reviewed. The spreadsheet should include the model element’s exact name, element type, location, intended function, reviewer, review status, identified issue or observation, required corrective action, and final resolution. Separate spreadsheets may be used for each element type to keep the review organized. This record provides evidence that the model was reviewed systematically and allows identified assumptions, missing dependencies, and corrective actions to be tracked through completion. An example spreadsheet can be found in [Appendix A](#appendix-a-suggested-review-workbook).

### 2.2 Definition of Intended Use and Acceptance Criteria

Before review and testing begin, the model’s intended use, scope, and applicable operating conditions should be documented. This definition should identify the decisions the model is intended to support, the real-world behaviors and credited capabilities it must represent, and the conditions outside which its results should not be applied. Expected behavior and acceptance criteria should be established using independent evidence, such as design documentation, plant procedures, engineering calculations, equipment data, operating experience, benchmark results, or subject-matter-expert review.

The responsible technical authority, supported by appropriate system experts and QA personnel, should determine whether the evidence is adequate for the intended application. A model may be considered acceptable for that use when applicable requirements and assumptions are traceable to review or test evidence, observed behavior satisfies the established acceptance criteria, identified findings have been resolved or formally dispositioned, and remaining limitations and uncertainties are documented. This conclusion applies only within the defined scope and does not establish validity for other plants, configurations, or applications.

## 3. Structural Review

The first step in verifying and validating an EMRALD Model is reviewing its structure, beginning with individual component Diagrams and progressing to larger system and scenario Diagrams. This order allows reviewers to understand each component before examining its interactions across the Model. Reviewers with knowledge of the represented system or scenario are especially well positioned to identify missing components, incorrect connections, and unrealistic logic.

Each model object should have a clear and accurate name and description consistent with its implemented function. When applicable, the description should identify relevant assumptions, units, thresholds, and data sources.

### 3.1 Diagram Review

For each Diagram, the reviewer should verify the following:

- That the correct Diagram type, either Single State (Evaluation) or Multi State, is selected. A Single State Diagram permits only one active State at a time and can be evaluated as a Model condition. A Multi State Diagram can have multiple active States simultaneously. The selected type should be consistent with the intended function of the Diagram.

- That the correct initial State or States are defined so that the Diagram begins in the intended Model condition.

### 3.2 State Review

For each State, the reviewer should verify the following:

- That the State Type, such as Start, Standard, Key State, or Terminal, matches its intended role in the Model.

- That any Immediate Actions assigned to a State are intended to occur whenever that State is entered.

### 3.3 Event Review

For each Event, the reviewer should verify the following:

- That any States, Variables, Distributions, or Logic Expressions referenced by an Event are correctly selected and used.

- That each Event triggers the intended Action or set of Actions. The reviewer should confirm that no required Actions are missing and that no unintended Actions are triggered.

- That each Event is reviewed to confirm that it uses the appropriate Event Type, references the correct Model elements, and triggers under the intended conditions. If Events use numerical values such as a distribution parameter, these should be verified and included in a spreadsheet with reference to a supporting data source or data sources. Because the required checks vary by Event Type, a detailed Event-review checklist is provided in [Appendix C, Section C.1](#c-1-event-review-checklist).

### 3.4 Action Review

Each Action should use the appropriate Action Type and produce the intended Model response. The reviewer should confirm that all required settings, inputs, and dependencies are correctly specified. Additional checks depend on the selected Action Type. A detailed Action-review checklist is provided in [Appendix C, Section C.2](#c-2-action-review-checklist).

### 3.5 Variable Review

Each Variable should be checked for the appropriate type, initial value, units, data source, and any applicable default or sentinel value. Default and sentinel values should be reviewed in the context of their intended use. The reviewer should confirm that the values are physically reasonable and consistent with associated Events, Actions, calculations, embedded code, and external inputs.

### 3.6 Logic-Tree Review

Logic Trees should be reviewed after the Diagrams, States, Events, and Actions that supply their inputs have been examined. For each tree, the reviewer should first state in plain language the condition that the Logic Tree is intended to represent. The reviewer should verify that each root Logic Tree is referenced by the intended Component Logic Events (more information found in [Appendix C, Section C.1](#c-1-event-review-checklist)) and that unused or incorrectly referenced trees are identified. The reviewer should then compare each Logic Tree statement they wrote with the implemented Gates and inputs, working from the top condition down to the lowest-level States or expressions. Each AND, OR, and NOT Gate should be checked to confirm that it represents the intended relationship, and each input should reference the correct State, Diagram, or sub-tree. The reviewer should also look for duplicated inputs, omitted dependencies, unintended inversions, and branches that can never become true.

The reviewer should test the Logic Tree with simple input combinations that cause the top condition to evaluate as both True and False. They should select the cases based on whether the tree is evaluated as a Success Tree or Failure Tree. For AND Gates, they should confirm that all required inputs are necessary; for OR Gates, they should test each input individually. Finally, reviewers should verify that the associated Component Logic Event uses the correct evaluation type and triggers on the intended result.

### 3.7 Connections and Model-Wide Review

Connections between Component, System, and Scenario Diagrams should correctly transfer State changes throughout the Model. Each link should be followed to confirm that it references the intended State in the correct Diagram.

After tracing the connected Model logic, the reviewer should perform a Model-wide inventory. This review should identify unused or orphaned Diagrams, States, Events, Actions, Variables, Distributions, and External Simulations that may not appear while following the connected logic.

## 4. Behavioral Testing

Behavioral testing evaluates whether a Model produces the expected results when relevant inputs, assumptions, conditions, or relationships are changed. Before each test, the reviewer should document the input conditions, expected sequence of Events, expected outcome, basis for that expectation, EMRALD version, Model version, run parameters, run count, and random seed when one is used. The expected behavior and acceptance criteria should be based on the evidence identified in Section 2.2. This information should be recorded in the separate EMRALD Model Test Set workbook. The workbook’s Notes section may be used to document the expected behavior and explain the observed results. The reviewer or another qualified analyst should then compare the actual simulation path and results with the expected behavior using the Debug File and Path Results File to confirm the executed path rather than rely on inference alone. The specific techniques used should be selected based on the Model’s purpose and features, since not every technique will apply to every model or scenario.

Acceptance criteria should be selected according to the purpose of each test. As applicable, a test is accepted when the implemented objects and logic agree with documented requirements; observed State transitions agree with the expected behavior; numerical boundaries behave correctly below, at, and above the applicable threshold; corrected findings pass regression testing; and stochastic results exhibit the expected ordering and trends relative to comparable cases, with the basis for that judgment documented. Any criterion that does not apply to a particular test should be identified as not applicable rather than treated as a failure.

### 4.1 Scenario-Path Tracing

Scenario-path tracing follows a selected scenario from initialization to outcome. Using the expected path documented during test planning, the reviewer should confirm that Events occur when their conditions are met, they trigger the correct Actions, and they produce the intended State transitions. Dependencies and time delays should also be checked. Any unexpected transition may indicate missing logic, an incorrect dependency, or an undocumented assumption. Because this technique exercises the Model end to end, it provides the reviewer with an overview of Model behavior before more targeted testing methods are applied.

### 4.2 Minimum-Combination, Dependency, Interaction, and Isolation Testing

**Minimum-combination testing.** Minimum-combination testing identifies the smallest combination of equipment failures, initiating events, unavailable components, or other modeled conditions required to produce a specified outcome. A candidate minimum combination can be identified from the applicable Logic Tree or system design and then tested as a complete set. The complete combination should produce the documented expected outcome. Each member should then be removed or reversed individually to confirm that the outcome is prevented or that the Model transitions to the appropriate alternative outcome. For example, an unavailable component may be restored, or a failed component may be returned to an operable state. Where multiple success or failure paths exist, each candidate minimum combination should be tested in this manner. In security models, these combinations may represent the minimum set of targets required to produce a consequence. Minimum-combination testing is particularly effective for diagnosing errors because it removes unrelated conditions and focuses the review on the smallest set capable of producing the outcome.

Because minimum-combination cases are small and clearly characterized, they can be retained as part of the Model’s regression baseline (see [Section 4.5](#_4-5-regression-testing)). Their limited scope makes changes in Model behavior easier to diagnose and allows the cases to be rerun efficiently after relevant Model modifications.

**Dependency and interaction testing.** Dependency and interaction testing confirm that relationships identified during the structural review affect Model execution as intended. The reviewer should hold other conditions constant while changing the availability of one supporting component, prerequisite, location, or resource. The resulting path should change only where that dependency is expected to have an effect. This technique can reveal missing connections, improperly credited equipment, unrealistic recovery paths, and interactions that were structurally present but did not function correctly during execution.

When dependencies are implemented through a Logic Tree, the applicable Gate combinations should be exercised using the truth-testing procedure described in [Section 3.6, “Logic-Tree Review”](#_3-6-logic-tree-review). The associated Component Logic Event and downstream Model path should respond as expected.

Dependency testing can be performed systematically by creating a dependency matrix. Each row identifies a modeled function or Action, and the columns identify its required supporting components, resources, locations, operator Actions, or preceding States. A base case is first run with all required dependencies available. One dependency is then removed or delayed at a time, with all other conditions held constant, and the expected and observed changes in the Model path and outcome are documented. Important combinations of dependencies should also be tested when their effects are not independent. This method complements minimum-combination testing: minimum-combination testing identifies the smallest combination that produces a consequence, while dependency testing confirms that each condition affects the Model through the intended relationship.

**Isolation testing.** Isolation testing is used when the behavior of a specific Event, Action, calculation, timing assumption, or probabilistic mechanism cannot be observed clearly in the fully integrated Model because competing paths can mask or compensate for its effect. The Model is temporarily reconfigured to suppress those competing paths, allowing the mechanism under review to be exercised under controlled inputs and compared with a documented expected response.

In EMRALD, competing States, Events, or Actions may be temporarily disabled or placed under controlled test conditions so that only the path under review can affect the result. Selected parameter values, including boundary values when applicable, can then be tested to confirm that the mechanism triggers under the intended conditions and produces the expected State transition or Key State. Distribution parameters may also be assigned controlled or deliberately extreme values to increase the likelihood of the path under review. The Path Results File, supported by diagnostic Key States when needed, should confirm that the Model followed the intended mechanism. Temporary diagnostic Key States may also be added to confirm through the Path Results File that runs followed the intended isolated path.

Timing behavior can also be evaluated through isolation testing by applying deliberately large differences in Event times or delays while competing paths are suppressed. For example, an Event or mechanism can first be configured to occur much earlier and then much later than the expected threshold. These widely separated values should produce clearly different and predictable paths or outcomes, making it easier to confirm that timing affects the Model as intended. Once this basic behavior is confirmed, values closer to the expected threshold can be tested to determine whether the transition occurs under the correct timing conditions and whether boundary conditions are handled correctly.

Isolation testing should be performed on a controlled copy of the Model. These tests use an intentionally altered Model configuration; their results should be clearly identified as diagnostic and should not be treated as representative of normal Model behavior. All disabled paths, diagnostic Key States, altered Distribution parameters, and other temporary modifications must be documented and restored before integrated testing.

### 4.3 Boundary, Timing, and Embedded-Code Testing

Boundary-condition testing evaluates Model behavior immediately below, exactly at, and immediately above decision thresholds. This type of testing can also be used to address applicable minimum and maximum values, simultaneous Events, zero or near-zero values, and Model-specific default or sentinel values. Each branch of an embedded conditional expression should be exercised. AND conditions should be tested with all terms true and then with each term false individually. OR conditions should be tested with each term true individually and then with all terms false. NOT conditions should be tested with the input both true and false. Mixed or nested expressions should be isolated to confirm that grouping, negation, and operator precedence produce the intended result.

When an intermediate Variable is reassigned before the logic under review is evaluated, changing only its initial value may not exercise the intended condition. The reviewer should instead vary the upstream input, Event timing, or component State responsible for assigning the Variable. The observed State transitions and Variable values should be compared with the documented expected behavior using the Debug and Path Results Files.

### 4.4 Stochastic Testing, Sensitivity Analysis, and Convergence

Stochastic testing evaluates Events, durations, or outcomes that are sampled probabilistically. The reviewer should confirm that sampled values remain within their defined ranges, probabilistic branches occur at reasonable frequencies, and different random seeds produce appropriate variation. A fixed seed should first be used to reproduce and diagnose individual paths. The same case should then be run with multiple seeds to determine whether the observed behavior is representative rather than an artifact of one sampled sequence. Multiple batches and increasing run counts can be compared to determine whether aggregate results are sufficiently stable for the analysis. This technique applies only when the Model contains stochastic behavior or is intended to produce probabilistic results.

Closely related to stochastic testing is sensitivity analysis, which evaluates how strongly a result responds to a single input Parameter rather than to random sampling variation. Whereas dependency testing asks whether a component is present or absent, sensitivity analysis systematically varies a Parameter’s value, such as a Failure Rate, a Distribution mean, or a fixed timing threshold, across a realistic range while holding all other conditions constant and observes how much the outcome changes in response. Parameters to which the result is highly sensitive deserve closer scrutiny of their data source, since an assumption resting on expert judgment or a rough estimate carries more risk if small changes in its value produce large changes in the Model’s conclusions.

Stochastic testing should also address convergence or run-count adequacy: the point at which additional runs no longer meaningfully change the reported result. The reviewer should track a key output metric, such as a failure rate or Key State frequency, as a function of cumulative run count, and confirm that the metric has stabilized within an acceptable tolerance before the run count is used for reporting. Comparing successive batches at increasing run counts is generally sufficient to demonstrate convergence and to justify the run count that is ultimately selected for the analysis. This method is preferable to adopting a round number without a basis.

### 4.5 Regression Testing

Regression testing should be performed after changes that could affect previously verified Model behavior. Regression testing confirms that Model changes do not unintentionally alter previously verified behavior. The baseline set of representative tests retained from minimum-combination testing (above) should be rerun after changes to Model logic, data, timing assumptions, dependencies, or embedded code; additional representative cases from later techniques in this section may be added to the baseline as they are developed. Deterministic cases should reproduce the same important paths, values, and outcomes. Stochastic regression cases should be rerun with the same seed, run count, Model version, and input Parameters used for the baseline so that differences caused by the Model change can be separated from ordinary sampling variation. A corrected error or an intentional logic change may appropriately alter paths or results; therefore, a difference is not automatically a regression. Each difference should be traced and classified as an expected effect of the approved change, an acceptable secondary effect, or an unintended regression requiring further review. After fixed-seed comparisons are complete, selected cases may also be run with additional seeds to confirm that the overall conclusion remains stable. Results from each Model version should be retained in the Test Set workbook so that regression-testing iterations can be compared. When regression testing supports a Jira issue, the issue should reference the applicable test IDs.

### 4.6 External-Interface Testing

Models that exchange data with an External Simulation should also be tested at the interface. The reviewer should verify that EMRALD sends the correct Variables, units, file paths, and command-line arguments; that the external application receives and interprets them correctly; and that returned values are mapped to the intended EMRALD Variables. Tests should include a normal exchange, representative limiting values, and expected failure conditions such as a missing file, invalid output, or unavailable executable. This is especially important when the Model relies on a surrogate Model or another external calculation to determine plant response.

Where a Model couples to more than one external tool developed independently—for example, a physical-security force-on-force tool feeding sabotage timing into EMRALD, which in turn drives a thermal-hydraulics surrogate—external-interface testing alone is not sufficient. Cross-tool consistency testing should confirm that Variable names, units, sign conventions, and time bases genuinely agree across tools rather than merely appearing to connect. A mismatch of this kind, such as one tool reporting time in seconds while another expects hours, will not raise an error; it will simply produce silently incorrect results. This check should be performed whenever an External Simulation Variable is added or renamed in any of the coupled tools.

### 4.7 Initialization and Repeat-Run Testing

The reviewer should confirm that each run begins from the documented initial States and Variable values and that results from a previous run do not carry into the next run. The same deterministic case should be executed more than once from a clean initialization and should reproduce the same path and outcome. This test is useful for Models with temporary files, externally calculated Variables, or Actions that update values during execution.

### 4.8 Traceability and Requirements-Based Testing

Unlike scenario-path tracing, which begins with a test case and follows its executed path, traceability testing begins with a documented requirement, assumption, credited capability, or modeled condition and identifies the evidence demonstrating that it is implemented correctly. For each applicable claim, the reviewer should identify its technical basis, where it is represented in the Model, and the test case or cases used to verify it. The expected result, observed result, supporting evidence files, and final status should also be documented. One test may address multiple related claims, while an important claim may require several tests to evaluate its different conditions or boundaries.

Traceability should connect each requirement or assumption to the applicable Model objects, test cases, results, evidence files, and final disposition. This traceability may be maintained through linked review IDs in the Table A1 Model Object Review workbook, test IDs in the EMRALD Model Test Set workbook, and Jira issue IDs for related findings and Model changes. For regulatory or audit-facing applications, these linked records allow a reviewer to trace a reported conclusion back through the applicable Model objects, test evidence, Model changes, and technical basis rather than relying on Model logic alone.

## References

1. Idaho National Laboratory, “[Event Modeling Risk Assessment using Linked Diagrams (EMRALD)](https://inl.gov/emrald/),” accessed August 24, 2026.
2. S. R. Prescott, R. Christian, V. Yadav, S. W. St Germain, and C. P. Chwasz, “Plant-Specific Model and Data Analysis using Dynamic Security Modeling and Simulation,” INL/RPT-23-73490, Revision 1, Idaho National Laboratory, November 2023.

## Appendix A. Suggested Review Workbook

Appendix A provides suggested structures for documenting the Model review and testing process. Table A1 presents the Model Object Review Log, which assigns one row to each reviewed EMRALD object. Table A2 presents the format used in the separate EMRALD Model Test Set workbook to record test inputs, results, Model versions, related tests, and notes. Jira is used to track findings, Model changes, related testing, and final resolution. Unique review IDs, test IDs, and Jira issue IDs link the three records and provide traceability from each reviewed object to its supporting test evidence and resolution.

**Table A1. Model Object Review Log**

| Review ID | Object name | Object type | Parent diagram or location | Logic/applicable checks completed | Review result or finding and notes | Jira issue ID |
|---|---|---|---|---|---|---|
| OR-001 | Exact EMRALD name | State, Event, Action, Variable, Logic Tree, etc. | Diagram or referenced location | Checks outlined in Sections 3 and 4 | No issue, or description of issue | Jira ID, if applicable |

**Table A2. EMRALD Model Test Set Workbook Structure**

| Field | Entry |
|---|---|
| **Test Information** | |
| Model | [Model version] |
| File Number | `EMRALDRunParams_[Test ID].json` |
| Jira Issue | [Issue ID, if applicable] |
| Related Test | [Test ID, if applicable] |
| **Common JSON Input Values** | |
| [VarName] | [Value] |
| **Test Input Values** | |
| [Test-specific input Variable] | [Value] |
| **Result Items** | |
| `Key_StateA` | [Observed result] |
| **Notes** | [Expected behavior and explanation of results] |

The separate EMRALD Model Test Set workbook is organized into worksheets for base cases, time-dependent tests, variable tests, boundary tests, and other test groups developed during the review. Within each worksheet, related tests are arranged side by side so that their inputs and results can be compared directly. Each test is identified by its run-parameter filename or test ID. The applicable input Variables and values are listed below the filename, followed by the observed output results, the Model version used for the run, related test cases, and notes. The Notes section may be used to record the expected behavior established during test planning, as described in Section 4, and to explain the observed results. When a test is rerun for regression testing, the results from each Model version should be retained so that changes can be compared. The applicable Jira issue should also be identified when the test investigates a finding or verifies a Model change.

### Issue and Model-Change Tracking

A tool such as Jira can be used to track findings and Model changes that require correction or formal disposition. Each issue should explain the identified problem, including the expected and observed behavior and the potential effect on the Model. It should also identify the affected Model version and objects and reference the applicable Table A1 review IDs and related tests.

When a change is implemented, the issue should explain the correction that was made, identify the revised Model version, and reference the tests used to verify the change. The issue may be closed after the finding has been corrected or dispositioned and the required verification and regression testing has been completed. Detailed test inputs, results, and supporting evidence should remain in the Test Set workbook.

## Appendix B. EMRALD Search and Output Files

Reviewers should use EMRALD’s search and output tools to trace Model relationships and confirm executed behavior. The search function requires exact object names, including matching spelling, spacing, and capitalization. “Expand Using” identifies the selected object’s dependencies, while “Expand Used By” identifies elements that depend on it. Reviewing both directions can reveal incorrect references, missing or disconnected logic, and unintended dependencies.

Before behavioral testing, generate the Debug and Path Results Files using a small, deliberately simple test case with a known seed. The Debug File records State entries and exits, triggering Events, and when detailed output is enabled, executed Actions. The Path Results File traces the State–Event–Action sequence leading to each Key State and reports associated rate, count, timing, and monitored-Variable information. Compare these files with the expected execution path to distinguish Model defects from incorrect reviewer predictions.

For instructions on EMRALD interface operation and output-file configuration, see [EMRALD Solver](./solver.md), in particular the [Simulation Controls](./solver.md#simulation-controls), [Path Results](./solver.md#path-results), and [Debug File](./solver.md#debug-file) sections, as well as [Backend Information](./backendInfo.md).[1]

## Appendix C. EMRALD Event and Action Review Checklists

### C.1 Event-Review Checklist

- Variable Condition Events: Verify that the conditional expression evaluates the intended Model behavior, references the correct Variables, and returns the expected Boolean result for values on both sides of each condition or boundary.

- State Change Events: Verify that the correct States are selected, the Event responds to entering or exiting those States as intended, and the appropriate option is selected when all or only one of the listed State conditions must be satisfied. Confirm whether the Event accounts for States that are already active when it is evaluated.

- Component Logic Events: Verify that the Event references the intended Logic Tree, uses the appropriate evaluation type, either Success Tree or Failure Tree, and is configured to trigger on the intended result, either True or False.

- Timer Events: Verify that the specified time or time Variable and its units are correct. Confirm whether the timer begins at the start of the simulation or upon entering the associated State, and whether it should retain or resample its value following a State change.

- Failure Rate Events: Verify that the failure rate or referenced Variable is correct, uses the intended time basis, and represents the applicable component failure behavior. If the Event is persistent, confirm that the sampled failure time should be retained between State changes.

- External Simulation Events: Verify that the Event uses the correct external message type and references the intended externally controlled Variable. When conditional code is used, confirm that it evaluates the received information correctly and triggers the Event under the intended conditions.

- Distribution Events: Verify that the selected probability Distribution, its parameters, and all associated time units are correct and supported by the Model basis. Confirm whether the sampled value should be retained between State changes and test that the generated values behave as expected, including at any specified bounds.

### C.2 Action-Review Checklist

- Transition Actions: Confirm that the Action transitions the Model to the intended destination State or States. Verify that probabilities are correctly entered as fixed-value or Variable-based probabilities. Confirm that the mutually exclusive option is applied when only one outcome should occur.

- Change Variable Value Actions: Confirm that the correct Variable is modified and that the selected New Value Source, code or a Distribution, is appropriate. If code is used, verify its logic, units, and referenced Variables. Include all referenced Variables in the Variables Used in Code list. If a Distribution is used, confirm that its type, parameters, bounds, units, and referenced Variables are appropriate.

- External Simulation Message Actions: Confirm that the intended External Simulation and simulation Action are selected. Verify that the message sends the correct information at the appropriate point in the scenario.

- Run Application Actions: Confirm that the Action runs the intended executable and that the correct execution method, either preprocessing code or a custom application, is selected. If preprocessing code is used, verify that it returns the correct command-line parameters, file paths, and input values in the format expected by the application. Confirm that all referenced Variables are included in the required Variable list, that the application runs at the intended point in the scenario, and that its outputs are correctly returned to or used by the EMRALD Model.
