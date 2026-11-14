// All store details live here so they can be updated in one place.
// Anything in [square brackets] is a placeholder — replace it with real info.

const storeInfo = {
  name: 'Reusing Your Whit',
  tagline: 'Pre-loved finds, student prices, less waste.',

  location: {
    building: '[Building name]',
    room: '[Room / floor]',
    address: '[Street address], Walla Walla, WA',
    mapUrl: '', // e.g. a Google Maps link; leave empty to hide the button
  },

  // Regular-semester hours.
  hours: [
    { days: '[Monday – Wednesday]', time: '[12:00 – 5:00 pm]' },
    { days: '[Thursday – Friday]', time: '[12:00 – 6:00 pm]' },
    { days: '[Saturday]', time: '[10:00 am – 2:00 pm]' },
    { days: 'Sunday', time: 'Closed' },
  ],
  hoursNote: 'Hours change during breaks and the move-in / move-out sales.',

  contact: {
    email: '[thrift@example.edu]',
    instagram: '[@reusingyourwhit]',
    instagramUrl: '', // e.g. https://instagram.com/yourhandle
  },

  // When the all-goods sales happen.
  moveOutDates: '[Late April – mid May]',
  moveInDates: '[Late August – early September]',
};

export default storeInfo;
