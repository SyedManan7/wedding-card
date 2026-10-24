/* One button, every design.

   Every event card on the site offers a way to get the date into a guest's
   own calendar. It used to be built three different ways (a server-rendered
   .ics link that only exists for a real, purchased site and 404s in every
   demo; two separate copies of a Google Calendar opener typed out by hand)
   and five designs had no way at all. This is the one implementation:
   client-side, works in a demo preview exactly as it does on a bought card,
   and asked for the same way everywhere.

   ciAddToCalendar(name, iso, venue, address) opens Google Calendar,
   pre-filled, in a new tab. Call it from an inline onclick -- see any
   `*-ev-cal` button for the pattern. */
function ciAddToCalendar(name, iso, venue, address) {
  var title = name || 'Wedding Event';
  var loc = [venue, address].filter(Boolean).join(', ');
  var start = iso ? new Date(iso) : new Date();
  if (isNaN(start.getTime())) start = new Date();
  var end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  function fmt(d) {
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  }

  var url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(title)
    + '&dates=' + fmt(start) + '/' + fmt(end)
    + '&location=' + encodeURIComponent(loc)
    + '&details=' + encodeURIComponent('Wedding celebration — Ceremonia Invites');

  window.open(url, '_blank', 'noopener');
}
