# Forge — Unity Game Planner

An interactive planning workspace for AI-first Unity development. Enter a game concept, shape the production plan, and turn each implementation task into a clear brief for your AI coding assistant.

## What you can do

- Plan gameplay systems, scenes, assets and AI coding tasks.
- Generate editable starter plans using Unity templates and genre keywords.
- Drag cards between production states and reorder work visually.
- Connect dependencies, prevent cycles and inspect the dependency map.
- Set milestone outcomes and dates, reorder milestones and track completion.
- Copy coding briefs with project context, dependencies, acceptance criteria and validation instructions.
- Search and filter work; undo recent changes.
- Export/import complete project JSON or export a readable Markdown plan.

## Use Forge

After GitHub Pages is enabled, open the deployment URL shown in this repository's **Actions** or **Settings → Pages**. No account or API key is required.

Each browser stores its own workspace. Plans are not uploaded to a server and are not shared with other visitors. Export JSON backups regularly: clearing browser data, using private browsing, changing browsers or changing devices can remove or separate your workspace. Import JSON to transfer a project.

Starter plans and coding briefs are template-based. Forge does not call an AI model, generate code or connect to the Unity Editor. Use the copied briefs with your preferred coding assistant and validate the results in Unity.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

```sh
npm test
npm run build
npm run preview
```

The build output is `dist/`, a static site that can also be served by other static hosts. Relative asset paths support the `/Forge/` GitHub Pages project path.

## Deploy to GitHub Pages

1. Push this source to the repository's `main` branch.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source.
3. Run **Deploy Forge to GitHub Pages**, or push another commit to `main`.
4. Open the verified deployment URL in the workflow output.

The workflow installs locked dependencies, runs tests, checks TypeScript, builds the app and deploys the static artifact. Repository hosting must permit GitHub Pages.

## Project structure

- `src/planner.tsx`: planner UI, board, dependency map, milestones and import/export.
- `src/planner-model.ts`: game-plan generation, dependencies, card movement and coding briefs.
- `src/project-validation.ts`: imported project validation.
- `src/workspace-storage.ts`: browser persistence and revision conflict checks.
- `tests/`: planning and persistence checks.

## Privacy

This standalone edition contains no private cloud workspace, database, account identifiers, access tokens or hosting credentials. It is separate from the original owner-private hosted edition. Publishing this repository does not change access to that private site.
