# Approval request — campaign-001-1

rule: H9 — contacting real people directly
blocking: true
campaign: campaign-001
experiment: EXP-001
raised: 2026-08-18

## What the OS wants to happen

Ten named small food businesses each receive one free 处暑 seasonal operations pack and one line offering the next six 节气 packs for ¥199.

## Why this needs you

Approval rule H9: agents may not contact real people. This is not a formality here — the recipients are real local businesses, the founder's reputation in that community is a real asset, and a sloppy send reads as spam.

**The OS has drafted every message. It has not sent, and cannot send, any of them.** Selecting the ten recipients also requires you: the OS cannot know who is in your contacts.

## Cost and reversibility

- Cash: ¥0
- Founder time: ~40 minutes to send ten messages
- Reversible: yes, up to the moment of sending. Not after.

## What is being sent

- The pack: `campaigns/campaign-001/content/chushu-pack-v1.md`
- The messages: `campaigns/campaign-001/content/outreach-messages.md`, ten variants, each with a unique tracking code

Read both before approving. Do not approve a message you have not read.

## If you deny this

EXP-001 does not run. The fallback is EXP-002 (consumer pre-order), which is itself blocked on the payment-rail question, and EXP-003 (the free kill sweep), which runs regardless. Denying this leaves the campaign with no revenue test in flight.

## Sign here

decision: PENDING
signed_by:
date:
