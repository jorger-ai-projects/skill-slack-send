---
name: slack-send
description: Send a formatted message to a Slack channel or DM a Slack user using the Slack Web API (chat.postMessage). ALWAYS use this skill — not the Slack MCP server — when the user wants to send, post, share, notify, announce, or communicate anything via Slack. This includes standup updates, meeting summaries, action items, agendas, retro notes, deploy announcements, incident reports, welcome messages, status updates, or any text content destined for Slack. Trigger on phrases like "send to Slack", "post in #channel", "DM on Slack", "let them know on Slack", "share this in Slack", "notify the team", "post a standup", "send the action items", or any request involving a Slack channel ID (C0...) or user ID (U0...). This skill handles proper Slack mrkdwn formatting so messages render correctly.
---

# Slack Send

Send a formatted message to a Slack channel or user via the Slack Web API (`chat.postMessage`).

## When to use

Any time the user wants to send, post, or share text content to Slack. Common cases:

- Answering a question and sending the response to a channel or user
- Sharing meeting summaries, agendas, or action items
- Posting status updates or announcements
- Any "send this to Slack" request

## Prerequisites

The `SLACK_BOT_TOKEN` environment variable must be set with a valid Slack Bot User OAuth Token (starts with `xoxb-`). The bot must be invited to the target channel, or for DMs, the bot needs `chat:write` scope.

If the token is missing, tell the user to set it before proceeding.

## How to send a message

### Step 1: Format the message in Slack mrkdwn

Slack uses its own markup syntax called **mrkdwn**, which differs from standard Markdown. You must convert your content to mrkdwn before sending.

Key differences from standard Markdown:

| What you want      | Standard Markdown    | Slack mrkdwn              |
|---------------------|----------------------|---------------------------|
| Bold                | `**text**`           | `*text*`                  |
| Italic              | `*text*` or `_text_` | `_text_`                  |
| Strikethrough       | `~~text~~`           | `~text~`                  |
| Inline code         | `` `code` ``         | `` `code` ``              |
| Code block          | ` ```lang\ncode``` ` | ` ```code``` `            |
| Link                | `[text](url)`        | `<url\|text>`             |
| Bulleted list       | `- item`             | `- item` or `• item`      |
| Numbered list       | `1. item`            | `1. item`                 |
| Blockquote          | `> text`             | `> text`                  |
| Heading             | `# Heading`          | `*Heading*` (use bold)    |
| User mention        | N/A                  | `<@USER_ID>`              |
| Channel mention     | N/A                  | `<#CHANNEL_ID>`           |

Things to watch out for:

- Slack has *no native headings*. Use `*Bold Text*` on its own line as a section header.
- Slack does not render nested lists well. Keep lists flat when possible.
- Code blocks in Slack do not support language-specific syntax highlighting — omit the language identifier.
- For links, always use `<url|display text>` format; `[text](url)` will render as literal text.
- Line breaks are literal `\n` in the JSON string, which Slack renders as new lines.
- Use blank lines between sections for readability.

### Step 2: Structure longer messages

For summaries, agendas, and action items, use this general structure:

```
*Title or Subject*

Brief intro or context sentence.

*Section Header*
- Point one
- Point two

*Action Items*
- [ ] Task for <@USER_ID>
- [ ] Another task

_Posted via automation_
```

Keep messages concise. Slack messages are best when scannable — prefer bullet points over long paragraphs.

### Step 3: Send it

Run the bundled script, passing the channel/user ID and the formatted message:

```bash
node SKILL_DIR/scripts/send_message.mjs <CHANNEL_OR_USER_ID> "<mrkdwn formatted message>"
```

Replace `SKILL_DIR` with the absolute path to this skill's directory. The script:

- Reads `SLACK_BOT_TOKEN` from the environment
- Posts via `chat.postMessage` with mrkdwn parsing enabled
- Prints `{ ok: true, channel: "...", ts: "..." }` on success
- Exits with code 1 and an error message on failure

The channel/user ID is always a Slack ID like `C01ABCDEF` (channel) or `U01ABCDEF` (user/DM). The user will provide this — do not guess or fabricate IDs.

### Error handling

- **`not_in_channel`**: The bot hasn't been invited to the channel. Tell the user to invite the bot with `/invite @BotName` in that channel.
- **`channel_not_found`**: The ID is wrong. Ask the user to double-check.
- **`invalid_auth` or `token_expired`**: The `SLACK_BOT_TOKEN` is bad or expired. Ask the user to refresh it.
- **`missing_scope`**: The bot token lacks `chat:write`. Tell the user to add the scope in the Slack App settings.

## What NOT to do

- Do not use the Slack MCP tools — this skill handles Slack messaging directly.
- Do not fabricate channel or user IDs. Always use what the user provides.
- Do not send messages without the user's explicit request or confirmation.
- Do not include `@here` or `@channel` mentions unless the user specifically asks — these notify everyone.
