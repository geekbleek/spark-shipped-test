# Test for Cisco Shipped Container/CI Platform

This is a sample package for a Cisco Spark app/bot running on ciscoshipped.  It simply echo's any message seen in Spark.  When composing your app in ciscoshipped, you need to pass in the token for your bot account as an environment variable for: process.env.sparkToken (just sparkToken).

You need to change the email address of your user's identity to keep the echo from creating an infinite loop (echo'ing back to itself).  

Note: All webhooks for the user/bot account will be deleted on startup and set by this app to the ciscoshipped.io hostname.  This could be adjusted to only delete webhooks with a specific name etc such as "Cisco Shipped" to let others remain in place.
