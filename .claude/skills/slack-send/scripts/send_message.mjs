#!/usr/bin/env node

/**
 * Sends a message to a Slack channel or user via the Slack Web API.
 *
 * Usage:
 *   node send_message.mjs <channel_id> <message>
 *   node send_message.mjs <channel_id> --file <path>   (reads message from file)
 *
 * Environment: SLACK_BOT_TOKEN must be set.
 *
 * The message is sent as mrkdwn-formatted text. The script exits 0 on success
 * and prints the Slack API response. On failure it exits 1 with an error message.
 */

import { readFileSync } from "node:fs";

const [channelId, ...messageParts] = process.argv.slice(2);

if (!channelId || messageParts.length === 0) {
  console.error("Usage: node send_message.mjs <channel_id> <message>");
  console.error("       node send_message.mjs <channel_id> --file <path>");
  process.exit(1);
}

const token = process.env.SLACK_BOT_TOKEN;
if (!token) {
  console.error("Error: SLACK_BOT_TOKEN environment variable is not set.");
  process.exit(1);
}

let message;
if (messageParts[0] === "--file" && messageParts[1]) {
  message = readFileSync(messageParts[1], "utf8").trimEnd();
} else {
  message = messageParts.join(" ");
}

const body = JSON.stringify({
  channel: channelId,
  text: message,
  // Explicitly tell Slack to parse the text as mrkdwn
  mrkdwn: true,
});

const res = await fetch("https://slack.com/api/chat.postMessage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Bearer ${token}`,
  },
  body,
});

const data = await res.json();

if (!data.ok) {
  console.error(`Slack API error: ${data.error}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, channel: data.channel, ts: data.ts }));
