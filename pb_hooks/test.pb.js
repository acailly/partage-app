// @ts-check
/// <reference path="../pb_data/types.d.ts" />

routerAdd('GET', '/api/foo', (e) => {
  return e.json(200, {
    message: 'bar',
  });
});

routerAdd('GET', '/api/attendances/{attendanceId}/rsvp', (e) => {
  let attendanceId = e.request.pathValue('attendanceId');

  let attendanceRecord = $app.findRecordById('attendances', attendanceId);

  $app.expandRecord(attendanceRecord, ['event', 'guest'], null);
  const { collectionId, collectionName, created, updated, ...event } = attendanceRecord
    .expandedOne('event')
    .publicExport();
  const guest = attendanceRecord.expandedOne('guest').publicExport();

  const { id, response } = attendanceRecord.publicExport();

  return e.json(200, {
    data: {
      id,
      response,
      event,
      guest: {
        firstName: guest.firstName,
        lastName: guest.lastName,
      },
    },
  });
});

routerAdd('PUT', '/api/attendances/{attendanceId}/rsvp', (e) => {
  let attendanceId = e.request.pathValue('attendanceId');

  const body = e.requestInfo().body;
  const responsefromuser = body.response;

  let attendanceRecord = $app.findRecordById('attendances', attendanceId);
  attendanceRecord.set('response', responsefromuser);
  $app.save(attendanceRecord);

  return e.json(200, {});
});