# Slack Send Skill for Claude Code

A [Claude Code skill](https://docs.anthropic.com/en/docs/claude-code/skills) that sends messages to Slack channels or DMs users via the Slack Web API (`chat.postMessage`). It handles proper Slack mrkdwn formatting so messages render correctly.

## Features

- Send messages to Slack channels or DM users directly from Claude Code
- Automatic conversion to Slack's mrkdwn syntax (bold, italic, links, lists, code blocks, etc.)
- No external dependencies — uses Node.js built-in `fetch`
- No Slack MCP server required — interacts directly with the Slack Web API

## Prerequisites

- **Node.js** v18+ (for native `fetch` support)
- A **Slack App** with a Bot User OAuth Token (`xoxb-...`) that has the `chat:write` scope
- The bot must be invited to the target channel (for DMs, the `chat:write` scope is sufficient)

## Installation

Download the latest `slack-send.skill` zip file from [Releases](https://github.com/jorger-ai-projects/skill-slack-send/releases).

### For the current directory

Extract the skill into your project's `.claude/skills/` directory:

```bash
mkdir -p .claude/skills/slack-send
unzip slack-send.skill -d .claude/skills/slack-send
```

### For all projects (global installation)

Extract the skill into your global Claude Code skills directory:

```bash
mkdir -p ~/.claude/skills/slack-send
unzip slack-send.skill -d ~/.claude/skills/slack-send
```

### Set the environment variable

Add your Slack Bot token to your shell profile (e.g., `~/.zshrc`, `~/.bashrc`) or to your `.claude/settings.json`:

```bash
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
```

## Usage

Once installed, Claude Code will automatically trigger this skill when you ask it to send, post, or share content to Slack. Examples:

- "Send this summary to #general"
- "DM the action items to U01ABCDEF on Slack"
- "Post a standup update in C01ABCDEF"
- "Share this in Slack"

You need to provide the Slack channel ID (e.g., `C01ABCDEF`) or user ID (e.g., `U01ABCDEF`) — the skill will not guess or fabricate IDs.

## Skill Structure

```
slack-send/
  SKILL.md              # Skill definition and instructions
  scripts/
    send_message.mjs    # Node.js script that calls the Slack Web API
  evals/
    evals.json          # Skill evaluation tests
```

## Background
The skill was created using Anthropic's skill creator with the following prompt:
```
/skill-creator I need a skill that allows me to send messages to Slack (in socket mode) to users or channels via a Slack App. The skill should take the bot and app tokens via environment variables. Preferably, the skill should not rely on Slack MCP servers but instead interact directly with Slack. I don't need the skill to wait for a response. The skill should also ensure that any message sent to Slack is formatted properly using Slack's mrkdown syntax.   
```