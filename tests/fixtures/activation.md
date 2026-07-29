# Activation Fixtures

Replace the angle-bracket prompts with natural requests from the generated skill's domain before maintenance mode.

## Should Activate

| Prompt | Expected |
|---|---|
| <primary task phrased in the user's language> | Activate this skill and follow its primary workflow. |

## Should Not Activate as Primary

| Prompt | Expected |
|---|---|
| <adjacent task owned by another skill or normal repository workflow> | Hand off without pretending this skill owns the task. |
