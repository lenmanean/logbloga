# How to Enable Supabase Realtime for Notifications Table

## Important Note
The "Replication" page you're viewing is for **external data replication** (streaming to BigQuery, Snowflake, etc.), not for enabling Realtime subscriptions within Supabase.

## Correct Steps to Enable Realtime

### Method 1: Via Table Settings (Recommended)

1. **Navigate to Tables**
   - In the left sidebar, under "DATABASE MANAGEMENT", click on **"Tables"**
   
2. **Select the notifications table**
   - Find and click on the `notifications` table in the list
   
3. **Open Replication/Settings**
   - Look for a **"Replication"** tab or **"Settings"** tab at the top of the table view
   - Or look for a toggle/switch labeled **"Enable Realtime"** or **"Realtime"**
   
4. **Enable Realtime**
   - Toggle the switch to **enable** Realtime for the `notifications` table
   - Save changes if prompted

### Method 2: Via Database Settings

1. **Navigate to Database Settings**
   - In the left sidebar, under "CONFIGURATION", click on **"Settings"**
   
2. **Find Realtime Section**
   - Look for a section related to **"Realtime"** or **"Replication"**
   - Note: This might be in a different location depending on your Supabase version
   
3. **Enable for notifications table**
   - Find `notifications` in the list of tables
   - Enable Realtime for it

### Method 3: Via SQL Editor (Alternative)

If the UI doesn't have a clear option, you can enable it via SQL:

1. **Navigate to SQL Editor**
   - In the left sidebar, look for **"SQL Editor"** under "TOOLS" or elsewhere
   
2. **Run the following SQL**:
```sql
-- Enable Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

3. **Verify it's enabled**:
```sql
-- Check if notifications table is in the publication
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'notifications';
```

## Verification

After enabling Realtime, you can verify it's working:

1. **Test in your app**: Log in and place a test order
2. **Watch the notification badge**: It should update in real-time when a new notification is created
3. **Check browser console**: No errors related to Realtime subscriptions

## Troubleshooting

### If you can't find the option:
- The UI location may vary by Supabase version
- Try using Method 3 (SQL Editor) as it always works
- Check Supabase documentation for your specific version

### If Realtime doesn't work after enabling:
- Ensure you're using the correct Supabase client (`createClient` from `@/lib/supabase/client`)
- Check browser console for subscription errors
- Verify RLS policies allow the user to read their notifications
- Check that the `useNotifications` hook is properly subscribing

## Current Status

✅ Database migration applied successfully  
✅ Code implementation complete  
⏳ Realtime needs to be enabled (this step)

After enabling Realtime, your notifications will appear instantly in the UI without requiring a page refresh!
