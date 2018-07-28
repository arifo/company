import {
  ADD_COMPANY,
  EDIT_COMPANY,
  DELETE_COMPANY,
  SORT_A_TO_Z,
  SORT_MEMOS
} from '../actions/types';

// const initialState = {
//   companies: [
//     {
//       id: 'idOne',
//       name: 'Apple',
//       description:
//         "Apple Inc. is an American ...",
//       employees: [],
//       memos: [],
//     }

const initialState = {
  companies: [
    {
      id: 'idOne',
      name: 'Apple',
      description:
        "Apple Inc. is an American multinational technology company headquartered in Cupertino, California, that designs, develops, and sells consumer electronics, computer software, and online services. The company's hardware products include the iPhone smartphone, the iPad tablet computer, the Mac personal computer, the iPod portable media player, the Apple Watch smartwatch, the Apple TV digital media player, and the HomePod smart speaker. Apple's software includes the macOS and iOS operating systems, the iTunes media player, the Safari web browser, and the iLife and iWork creativity and productivity suites, as well as professional applications like Final Cut Pro, Logic Pro, and Xcode. Its online services include the iTunes Store, the iOS App Store and Mac App Store, Apple Music, and iCloud.",
      employees: [
        {
          id: '1',
          name: 'Amanda',
          phone: 8002225555,
          email: 'amanda@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 90,
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: ''
        },
        {
          id: '2',
          name: 'Betty',
          phone: 8623334255,
          email: 'Betty@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 85,
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '3',
          name: 'Charlotte',
          phone: 8002225555,
          email: 'Charlotte@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 55,
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '4',
          name: 'Donald',
          phone: 8623334255,
          email: 'mike@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 25,
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '5',
          name: 'Edward',
          phone: 8002225555,
          email: 'edward@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 95,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '6',
          name: 'Fabian',
          phone: 8623334255,
          email: 'fabian@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 35,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '7',
          name: 'George',
          phone: 8002225555,
          email: 'george@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 45,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '8',
          name: 'Helen',
          phone: 8623334255,
          email: 'helen@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 25,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '9',
          name: 'Isabel',
          phone: 8002225555,
          email: 'isabel@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 55,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '10',
          name: 'Jordan',
          label: 'Jordan',
          phone: 8623334255,
          email: 'jordan@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 65,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: '07/25/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        }
      ],
      memos: [
        {
          id: '1',
          title: 'Lorem Ipsum',
          note:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed pretium nisl, sit amet venenatis tellus. Etiam vel nulla id turpis commodo mollis. Sed fermentum, odio eget luctus finibus, ipsum nunc dictum est, ac volutpat felis felis et ipsum. Mauris varius nibh id leo convallis ornare. Morbi est erat, cursus a interdum id, auctor ac ex. Quisque vitae congue sapien, non pretium ligula. Donec odio elit, iaculis sit amet felis vitae, mattis viverra lorem. Curabitur eget nisl urna.',
          reminder: [{ remind: '12:00 09/20/2018' }, { remind: '18:00 09/20/2018' }],
          createdAt: '01/01/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '2',
          title: 'Proin nisi dui, gravida in ex non, semper mollis ante.',
          note:
            'Vestibulum mollis dapibus magna, in mattis ipsum vestibulum sit amet. Phasellus eros augue, ornare eu justo eget, vulputate vestibulum felis. Donec in sapien quis mauris cursus molestie. Cras rutrum lorem vitae erat placerat, quis sagittis nulla efficitur. Sed efficitur justo ac enim semper tristique. Vestibulum scelerisque tortor mi, quis placerat sem lobortis sit amet. Proin scelerisque porttitor lorem, at tempor erat feugiat quis. Suspendisse sed convallis purus, at volutpat augue. Donec sapien ipsum, pharetra bibendum felis ut, convallis accumsan neque. Cras hendrerit orci sed aliquam viverra. Quisque sed bibendum ex. Aenean in enim vitae libero blandit ultricies et vitae risus. Suspendisse potenti. Nulla tincidunt magna sit amet purus auctor, quis suscipit orci molestie.',
          reminder: [{ remind: '12:00 09/20/2018' }, { remind: '18:00 09/20/2018' }],
          createdAt: '02/02/2018 12:14:35',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '3',
          title: 'Nunc finibus mollis volutpat.',
          note:
            'Mauris semper vestibulum tempus. Nulla efficitur, purus non accumsan pulvinar, erat diam mattis nulla, ut aliquam lectus risus commodo neque. Curabitur sed purus in eros auctor semper quis a leo. Nullam commodo pharetra malesuada. In eget risus quis magna faucibus sollicitudin. Fusce vestibulum, nunc a viverra efficitur, ex lectus pulvinar mi, sit amet tincidunt velit tellus eget elit.',
          reminder: [{ remind: '12:00 09/20/2018' }, { remind: '18:00 09/20/2018' }],
          createdAt: '03/03/2018 8:04:45',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '4',
          title: 'Donec pulvinar in sem id molestie.',
          note:
            'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed ac lobortis tortor. Integer egestas, turpis sit amet porttitor bibendum, odio libero finibus ligula, vitae dapibus est velit sed sapien. Morbi cursus lobortis nunc eu porta. Nam id hendrerit tortor. Phasellus at odio lacus.',
          reminder: [{ remind: '12:00 09/20/2018' }, { remind: '18:00 09/20/2018' }],
          createdAt: '04/04/2018 10:09:25',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '5',
          title: 'Aliquam tincidunt sapien ut justo rhoncus venenatis. ',
          note:
            'Sed non sagittis diam, vitae eleifend sapien. Vivamus nec tincidunt lorem. Quisque vitae elementum magna, non vulputate dolor. Duis id malesuada felis. Donec auctor ultrices malesuada. Duis auctor sem vel diam mattis efficitur. Nam consectetur, est ut semper aliquam, odio orci rutrum ex, quis egestas tellus justo vitae leo. Praesent at velit sodales, porttitor dolor id, pretium risus.',
          reminder: [{ remind: '12:00 09/20/2018' }, { remind: '18:00 09/20/2018' }],
          createdAt: '05/05/2018 20:28:34',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '6',
          title: 'Donec sed pretium nisl, sit amet venenatis tellus.',
          note:
            'Etiam vel nulla id turpis commodo mollis. Sed fermentum, odio eget luctus finibus, ipsum nunc dictum est, ac volutpat felis felis et ipsum. Mauris varius nibh id leo convallis ornare. Morbi est erat, cursus a interdum id, auctor ac ex. Quisque vitae congue sapien, non pretium ligula. Donec odio elit, iaculis sit amet felis vitae, mattis viverra lorem. Curabitur eget nisl urna.',
          reminder: [{ remind: '12:00 09/20/2018' }, { remind: '18:00 09/20/2018' }],
          createdAt: '06/06/2018 18:49:15',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '7',
          title: 'Cras eu nisl purus.',
          note:
            'Integer egestas felis velit, a tincidunt erat feugiat non. Nulla placerat nibh in nibh scelerisque molestie. Sed porta risus id rutrum bibendum. Phasellus et purus dolor. Aliquam est enim, ultricies nec pellentesque nec, pretium non metus. Nunc sed tincidunt nisi. Duis ornare, ipsum quis rhoncus imperdiet, est neque sagittis velit, sit amet iaculis sem nunc in urna. Nam in metus tortor. Etiam non quam libero. Pellentesque bibendum odio iaculis, molestie nisi eget, gravida enim. Integer ac accumsan sapien. Integer feugiat enim arcu, vitae pretium neque molestie a.',
          reminder: [{ remind: '12:30 09/20/2018' }],
          createdAt: '07/07/2018 18:49:15',
          lastModified: ''
        },
        {
          id: '8',
          title: 'Sed non sagittis diam, vitae eleifend sapien. ',
          note:
            'Aliquam tincidunt sapien ut justo rhoncus venenatis. Vivamus nec tincidunt lorem. Quisque vitae elementum magna, non vulputate dolor. Duis id malesuada felis. Donec auctor ultrices malesuada. Duis auctor sem vel diam mattis efficitur. Nam consectetur, est ut semper aliquam, odio orci rutrum ex, quis egestas tellus justo vitae leo. Praesent at velit sodales, porttitor dolor id, pretium risus.',
          reminder: [{ remind: '12:00 09/20/2018' }, { remind: '18:00 09/20/2018' }],
          createdAt: '08/08/2018 21:28:34',
          lastModified: '07/28/2018 9:24:36'
        },
        {
          id: '9',
          title: 'Mauris semper vestibulum tempus.',
          note:
            'Nunc finibus mollis volutpat. Nulla efficitur, purus non accumsan pulvinar, erat diam mattis nulla, ut aliquam lectus risus commodo neque. Curabitur sed purus in eros auctor semper quis a leo. Nullam commodo pharetra malesuada. In eget risus quis magna faucibus sollicitudin. Fusce vestibulum, nunc a viverra efficitur, ex lectus pulvinar mi, sit amet tincidunt velit tellus eget elit.',
          reminder: [{ remind: '12:00 09/20/2018' }, { remind: '18:00 09/20/2018' }],
          createdAt: '09/09/2018 18:54:45',
          lastModified: '07/28/2018 9:24:36'
        }
      ]
    },
    {
      id: 'someID',
      name: 'Berkshire Hathaway',
      description: 'very good Berkshire Hathaway company ...',
      employees: [
        {
          id: '7sdf8sdfs27f5',
          name: 'Peter',
          phone: 8002225555,
          email: 'peter@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 4.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdf8sdfs27f5',
          name: 'Mike',
          phone: 8623334255,
          email: 'mike@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 2.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdf8sdfs27f5',
          name: 'Mike',
          phone: 8623334255,
          email: 'mike@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 2.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        }
      ],
      memos: [
        {
          id: '8sdf46s4s6d4f',
          title: 'To do...',
          note: 'how to acomplish to do',
          reminder: [{ createdAt: '1518449005768' }]
        },
        {
          id: '5ad6546s4s6d4f',
          title: 'More To do...',
          note: 'how to acomplish this one',
          reminder: [{ createdAt: '1518449005768' }]
        },
        {
          id: '8sdf46s4s6d4f',
          title: 'To do...',
          note: 'how to acomplish to do',
          reminder: [{ createdAt: '1518449005768' }]
        },
        {
          id: '5ad6546s4s6d4f',
          title: 'More To do...',
          note: 'how to acomplish this one',
          reminder: [{ createdAt: '1518449005768' }]
        }
      ]
    },
    {
      id: 'idTwo',
      name: 'Kuku',
      description: 'Kuku Inc. is an American company...',
      employees: [],
      memos: []
    }
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMPANY: {
      console.log('ADD_COMPANY', action.payload);
      return { ...state, companies: action.payload };
    }
    case DELETE_COMPANY: {
      return { ...state, companies: action.payload };
    }
    case EDIT_COMPANY: {
      return { ...state, companies: action.payload };
    }
    case SORT_A_TO_Z: {
      console.log('Sort_COMPANY', action.payload);
      return { ...state, companies: action.payload };
    }
    // case SORT_MEMOS: {
    //   console.log('Sort_MEMOS', action.payload);
    //   return { ...state,
    //     companies: { ...state.companies, action.payload } };
    // }
    default:
      return state;
  }
};
