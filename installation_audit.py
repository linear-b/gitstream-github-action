"""
gitstream-cm[bot] Activity Auditor (PAT version)
Fetches all audit log actions by gitstream-cm[bot] across orgs within a time window.

Requirements:
    pip install requests

Usage:
    python installation_audit.py linearbtest --token ghp_xxx
"""

import requests
import json
import csv
import logging
from datetime import datetime, timezone
from collections import Counter

# ─── CONFIG ──────────────────────────────────────────────────────────────────

PAT       = None    # passed via --token CLI argument

TIME_FROM = datetime(2026, 3, 30, 0, 0, 0, tzinfo=timezone.utc)
TIME_TO   = datetime(2026, 4, 4, 23, 59, 59, tzinfo=timezone.utc)

OUTPUT_CSV  = "bot_activity.csv"

# ─── SETUP ───────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("audit.log")]
)
log = logging.getLogger(__name__)

HEADERS = {
    "Authorization": f"Bearer {PAT}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
}

# ─── HELPERS ─────────────────────────────────────────────────────────────────

def parse_ts(ts) -> datetime:
    if isinstance(ts, int):  # milliseconds epoch (@timestamp field)
        return datetime.fromtimestamp(ts / 1000, tz=timezone.utc)
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))

# ─── CORE ────────────────────────────────────────────────────────────────────

def fetch_audit_log(org: str, time_from: datetime, time_to: datetime) -> tuple[list[dict], str]:
    """
    Returns (entries, status) where status is one of:
      "ok" | "no_access" | "not_found" | "error"
    """
    url = (
        f"https://api.github.com/orgs/{org}/audit-log"
        f"?phrase=actor:gitstream-cm%5Bbot%5D&include=all&per_page=100"
    )

    matches = []

    while url:
        resp = requests.get(url, headers=HEADERS, timeout=15)

        if resp.status_code == 403:
            return [], "no_access"
        if resp.status_code == 404:
            return [], "not_found"
        if resp.status_code != 200:
            return [], f"error_{resp.status_code}"

        entries = resp.json()
        if not entries:
            break

        for entry in entries:
            ts = entry.get("@timestamp") or entry.get("created_at", 0)
            dt = parse_ts(ts)

            if dt < time_from:
                return matches, "ok"

            if time_from <= dt <= time_to:
                matches.append({
                    "org"       : org,
                    "timestamp" : dt.isoformat(),
                    "action"    : entry.get("action"),
                    "actor"     : entry.get("actor"),
                    "repo"      : entry.get("repo"),
                    "details"   : json.dumps({
                        k: v for k, v in entry.items()
                        if k not in ("action", "actor", "repo", "@timestamp", "created_at")
                    })
                })

        # Next page
        url = next(
            (p.split(";")[0].strip().strip("<>")
             for p in resp.headers.get("Link", "").split(",")
             if 'rel="next"' in p),
            None
        )

    return matches, "ok"

# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Audit gitstream-cm[bot] actions in a GitHub org")
    parser.add_argument("org",     help="GitHub org name (e.g. my-company)")
    parser.add_argument("--token", required=True, help="GitHub PAT with read:audit_log + read:org scopes")
    args = parser.parse_args()

    global PAT, HEADERS
    PAT     = args.token
    HEADERS = {
        "Authorization": f"Bearer {PAT}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    log.info(f"Org    : {args.org}")
    log.info(f"Window : {TIME_FROM.isoformat()} → {TIME_TO.isoformat()}")

    all_entries  = []
    entries, status = fetch_audit_log(args.org, TIME_FROM, TIME_TO)

    if entries:
        log.info(f"⚠️  {args.org} — {len(entries)} actions found")
        all_entries.extend(entries)
    else:
        log.info(f"{args.org} — {status}")

    # ── Write CSV
    if all_entries:
        csv_fields = ["timestamp", "action", "repo", "token_type", "conclusion",
                       "workflow_run_id", "user_agent"]
        csv_rows = []
        for e in sorted(all_entries, key=lambda x: x["timestamp"]):
            details = json.loads(e["details"])
            csv_rows.append({
                "timestamp":       e["timestamp"],
                "action":          e["action"],
                "repo":            details.get("repository", e.get("repo", "")),
                "token_type":      details.get("programmatic_access_type", ""),
                "conclusion":      details.get("conclusion", ""),
                "workflow_run_id": details.get("workflow_run_id", ""),
                "user_agent":      details.get("user_agent", ""),
            })
        with open(OUTPUT_CSV, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=csv_fields)
            writer.writeheader()
            writer.writerows(csv_rows)
        log.info(f"CSV written → {OUTPUT_CSV}")

    # ── Summary
    log.info("\n" + "=" * 50)
    log.info(f"Total actions found : {len(all_entries)}")

    if all_entries:
        # Group by action type
        action_counts = Counter(e["action"] for e in all_entries)
        log.info(f"\nActions performed:")
        for action, count in action_counts.most_common():
            log.info(f"  {action}: {count}")

        # Repos targeted
        repo_counts = Counter(e["repo"] for e in all_entries)
        log.info(f"\nRepos targeted:")
        for repo, count in repo_counts.most_common():
            log.info(f"  {repo}: {count}")

        # Detailed timeline — every action
        log.info(f"\nTimeline:")
        for e in sorted(all_entries, key=lambda x: x["timestamp"]):
            details = json.loads(e["details"])
            extra = ""
            if e["action"].startswith("git."):
                extra = f"| repo: {details.get('repository', e['repo'])}"
            elif e["action"] == "workflows.created_workflow_run":
                extra = f"| repo: {e['repo']} | token_type: {details.get('programmatic_access_type', '?')}"
            elif e["action"] == "workflows.completed_workflow_run":
                extra = f"| repo: {e['repo']} | conclusion: {details.get('conclusion', '?')}"
            log.info(f"  {e['timestamp']} | {e['action']} {extra}")

    log.info(f"\nResults → {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
