# Analyze Google Search Console and GA4 exports

If you can export an authorized Google report, you can share the file with an assistant whose chat application supports reading that file format. Choose the report for your question and export only the data needed for the analysis. Keep Google credentials, customer identifiers and unnecessary personal data out of the attachment and conversation.

## Export Search Console performance

1. Open [Google Search Console](https://search.google.com/search-console) and select the exact property.
2. Open the Performance report for the relevant search surface, then choose the date range, search type, country and device filters, and table dimension.
3. For a comparison, export each completed period with the same filters and dimension. Export Pages and Queries separately when both dimensions matter.
4. Click Export and choose CSV, Excel or Google Sheets. If you choose Sheets, download a copy the assistant can read.
5. Keep the chart totals alongside the needed tables and record each file's property, search type, date range, filters and table dimension.

Search Console report exports can contain only 1,000 representative table rows even when chart totals cover more observations. Queries can omit anonymized or low-volume searches. Page-grouped tables and property-level chart totals can count observations differently. An exported zero may represent a value shown as unavailable in the report. [Google's Search Console export instructions](https://support.google.com/webmasters/answer/12919797) and [report discrepancy guidance](https://support.google.com/webmasters/answer/17010575).

Separate Pages and Queries tables describe their own groupings. If the decision depends on a specific page-and-query pair, supply a report that gives the needed pair or a query table explicitly filtered to the exact page. See the [Google report evidence reference](../skills/seo-agent-tools/references/google-report-evidence.md) for compatible comparisons.

## Export GA4 reports

1. Open [Google Analytics](https://analytics.google.com/) and select the exact GA4 property.
2. Open the report for the question, such as acquisition, landing pages or events.
3. Select the dates, acquisition scope and compatible dimensions and metrics. Specify whether the question concerns all Organic Search or Google organic traffic.
4. In Reports, select Share this report, Download File, then Download CSV. You can also export to Google Sheets and download a copy.
5. For measurement questions, include event names and definitions plus any relevant settings or tracking changes with their observation dates.

GA4 CSV and Sheets report exports can contain up to 100,000 rows. The report preserves its filters and measurement scope. An ordered progression question needs compatible funnel evidence with step definitions, cohort and entry rules. Independent event totals only establish the counts those reports measured. [Google's GA4 report-export instructions](https://support.google.com/analytics/answer/9317657).

## Attach the files and explain the decision

Attach the readable CSV or XLSX files in the conversation. Identify the report, property, periods, filters, dimensions and metrics for each file. If your chat application cannot read an attachment, provide a supported format or paste the relevant rows and scope.

> Compare the attached reports for the two completed periods using the stated filters. Show which landing pages contributed most to the change in Search Console clicks, explain what the GA4 report establishes about Google organic sessions and recorded events, and recommend the next check. Flag missing evidence and give separate source totals.

When comparing sources, keep Search Console clicks distinct from GA4 sessions and recorded events. Daily Search Console Performance dates generally follow Pacific Time and GA4 follows the property reporting timezone. A current measurement setting and historical recorded outcomes need their own observations. [Google's Search Console time and scope guidance](https://support.google.com/webmasters/answer/17011259).

For indexing questions, provide the relevant date, exact property or URL, and the exported or copied status evidence. Sitemap submission, indexed-version observations and live page behavior have different scopes. Keep the evidence for each one separately.
