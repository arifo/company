import update from 'immutability-helper';

import { ADD_MEMO, DELETE_MEMO, EDIT_MEMO } from '../actions/types';

const initialState = {
  memos: {
    byId: {
      memoID1: {
        id: 'memoID1',
        companyID: 'companyID1',
        title: 'Lorem Ipsum',
        note:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed pretium nisl, sit amet venenatis tellus. Etiam vel nulla id turpis commodo mollis. Sed fermentum, odio eget luctus finibus, ipsum nunc dictum est, ac volutpat felis felis et ipsum. Mauris varius nibh id leo convallis ornare. Morbi est erat, cursus a interdum id, auctor ac ex. Quisque vitae congue sapien, non pretium ligula. Donec odio elit, iaculis sit amet felis vitae, mattis viverra lorem. Curabitur eget nisl urna.',
        reminders: ['12:00 09/21/2018', '15:00 09/22/2018', '18:00 09/23/2018', '20:00 09/24/2018'],
        createdAt: '01/01/2018 18:49:15',
        lastModified: '07/28/2018 9:24:36'
      },
      memoID2: {
        id: 'memoID2',
        companyID: 'companyID1',
        title: 'Proin nisi dui, gravida in ex non, semper mollis ante.',
        note:
          'Vestibulum mollis dapibus magna, in mattis ipsum vestibulum sit amet. Phasellus eros augue, ornare eu justo eget, vulputate vestibulum felis. Donec in sapien quis mauris cursus molestie. Cras rutrum lorem vitae erat placerat, quis sagittis nulla efficitur. Sed efficitur justo ac enim semper tristique. Vestibulum scelerisque tortor mi, quis placerat sem lobortis sit amet. Proin scelerisque porttitor lorem, at tempor erat feugiat quis. Suspendisse sed convallis purus, at volutpat augue. Donec sapien ipsum, pharetra bibendum felis ut, convallis accumsan neque. Cras hendrerit orci sed aliquam viverra. Quisque sed bibendum ex. Aenean in enim vitae libero blandit ultricies et vitae risus. Suspendisse potenti. Nulla tincidunt magna sit amet purus auctor, quis suscipit orci molestie.',
        reminders: ['12:00 09/20/2018', '18:00 09/20/2018'],
        createdAt: '02/02/2018 12:14:35',
        lastModified: '07/28/2018 9:24:36'
      },
      memoID3: {
        id: 'memoID3',
        companyID: 'companyID1',
        title: 'Nunc finibus mollis volutpat.',
        note:
          'Mauris semper vestibulum tempus. Nulla efficitur, purus non accumsan pulvinar, erat diam mattis nulla, ut aliquam lectus risus commodo neque. Curabitur sed purus in eros auctor semper quis a leo. Nullam commodo pharetra malesuada. In eget risus quis magna faucibus sollicitudin. Fusce vestibulum, nunc a viverra efficitur, ex lectus pulvinar mi, sit amet tincidunt velit tellus eget elit.',
        reminders: ['12:00 09/20/2018', '18:00 09/20/2018'],
        createdAt: '03/03/2018 8:04:45',
        lastModified: '07/28/2018 9:24:36'
      },
      memoID4: {
        id: 'memoID4',
        companyID: 'companyID2',
        title: 'Donec pulvinar in sem id molestie.',
        note:
          'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed ac lobortis tortor. Integer egestas, turpis sit amet porttitor bibendum, odio libero finibus ligula, vitae dapibus est velit sed sapien. Morbi cursus lobortis nunc eu porta. Nam id hendrerit tortor. Phasellus at odio lacus.',
        reminders: ['12:00 09/20/2018', '18:00 09/20/2018'],
        createdAt: '04/04/2018 10:09:25',
        lastModified: '07/28/2018 9:24:36'
      },
      memoID5: {
        id: 'memoID5',
        companyID: 'companyID2',
        title: 'Aliquam tincidunt sapien ut justo rhoncus venenatis. ',
        note:
          'Sed non sagittis diam, vitae eleifend sapien. Vivamus nec tincidunt lorem. Quisque vitae elementum magna, non vulputate dolor. Duis id malesuada felis. Donec auctor ultrices malesuada. Duis auctor sem vel diam mattis efficitur. Nam consectetur, est ut semper aliquam, odio orci rutrum ex, quis egestas tellus justo vitae leo. Praesent at velit sodales, porttitor dolor id, pretium risus.',
        reminders: ['12:00 09/20/2018', '18:00 09/20/2018'],
        createdAt: '05/05/2018 20:28:34',
        lastModified: '07/28/2018 9:24:36'
      },
      memoID6: {
        id: 'memoID6',
        companyID: 'companyID2',
        title: 'Donec sed pretium nisl, sit amet venenatis tellus.',
        note:
          'Etiam vel nulla id turpis commodo mollis. Sed fermentum, odio eget luctus finibus, ipsum nunc dictum est, ac volutpat felis felis et ipsum. Mauris varius nibh id leo convallis ornare. Morbi est erat, cursus a interdum id, auctor ac ex. Quisque vitae congue sapien, non pretium ligula. Donec odio elit, iaculis sit amet felis vitae, mattis viverra lorem. Curabitur eget nisl urna.',
        reminders: ['12:00 09/20/2018', '18:00 09/20/2018'],
        createdAt: '06/06/2018 18:49:15',
        lastModified: '07/28/2018 9:24:36'
      },
      memoID7: {
        id: 'memoID7',
        companyID: 'companyID3',
        title: 'Cras eu nisl purus.',
        note:
          'Integer egestas felis velit, a tincidunt erat feugiat non. Nulla placerat nibh in nibh scelerisque molestie. Sed porta risus id rutrum bibendum. Phasellus et purus dolor. Aliquam est enim, ultricies nec pellentesque nec, pretium non metus. Nunc sed tincidunt nisi. Duis ornare, ipsum quis rhoncus imperdiet, est neque sagittis velit, sit amet iaculis sem nunc in urna. Nam in metus tortor. Etiam non quam libero. Pellentesque bibendum odio iaculis, molestie nisi eget, gravida enim. Integer ac accumsan sapien. Integer feugiat enim arcu, vitae pretium neque molestie a.',
        reminders: ['12:30 09/20/2018'],
        createdAt: '07/07/2018 18:49:15',
        lastModified: ''
      },
      memoID8: {
        id: 'memoID8',
        companyID: 'companyID3',
        title: 'Sed non sagittis diam, vitae eleifend sapien. ',
        note:
          'Aliquam tincidunt sapien ut justo rhoncus venenatis. Vivamus nec tincidunt lorem. Quisque vitae elementum magna, non vulputate dolor. Duis id malesuada felis. Donec auctor ultrices malesuada. Duis auctor sem vel diam mattis efficitur. Nam consectetur, est ut semper aliquam, odio orci rutrum ex, quis egestas tellus justo vitae leo. Praesent at velit sodales, porttitor dolor id, pretium risus.',
        reminders: ['12:00 09/20/2018', '18:00 09/20/2018'],
        createdAt: '08/08/2018 21:28:34',
        lastModified: '07/28/2018 9:24:36'
      },
      memoID9: {
        id: 'memoID9',
        companyID: 'companyID3',
        title: 'Mauris semper vestibulum tempus.',
        note:
          'Nunc finibus mollis volutpat. Nulla efficitur, purus non accumsan pulvinar, erat diam mattis nulla, ut aliquam lectus risus commodo neque. Curabitur sed purus in eros auctor semper quis a leo. Nullam commodo pharetra malesuada. In eget risus quis magna faucibus sollicitudin. Fusce vestibulum, nunc a viverra efficitur, ex lectus pulvinar mi, sit amet tincidunt velit tellus eget elit.',
        reminders: ['12:00 09/20/2018', '18:00 09/20/2018'],
        createdAt: '09/09/2018 18:54:45',
        lastModified: '07/28/2018 9:24:36'
      }
    },
    allIds: [
      'memoID1',
      'memoID2',
      'memoID3',
      'memoID4',
      'memoID5',
      'memoID6',
      'memoID7',
      'memoID8',
      'memoID9'
    ]
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_MEMO: {
      console.log(action.payload, action.companyId);
      return { ...state };
    }
    case DELETE_MEMO: {
      console.log(action.payload, action.companyId);
      return { ...state };
    }
    case EDIT_MEMO: {
      console.log(action.payload, action.companyId);
      return { ...state };
    }
    default:
      return state;
  }
};
