# Board Game Geek Sync Logged Plays

This Cloudflare Worker runs a CRON job to add logged games that you have been added to from someone else's BGG account. For example, if user 1 adds a logged play and includes user 2 as a player in that logged play, then that logged play will also be added to user 2's logged plays.

## Secrets

| Variable                 | Description                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| BGG_SOURCE_USERNAME      | Username of user you want to copy logged plays from. Will only copy logged plays that the destination user is a player in. |
| BGG_DESTINATION_USERNAME | Username of user you want to copy logged plays to.                                                                         |
| BGG_DESTINATION_PASSWORD | Password of user you want to copy logged plays to.                                                                         |

To setup the secrets you need for local development, create a copy of `.dev.vars.example` called `.dev.vars` and set the variables to the actual values. Once you deploy, you can manage your secrets in Cloudflare.

## Limitations

- Currently this CRON job will only look at the 100 most recent logged plays, in order of play date.
- Logged plays that are modified after they have been copied will result in a new logged play, it will not delete or modify the stale logged play that was already copied.
- Requests to the BGG API are throttled to once every 5 seconds.
