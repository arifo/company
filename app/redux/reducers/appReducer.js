import { ADD_COMPANY, EDIT_COMPANY, DELETE_COMPANY, SORT_A_TO_Z } from '../actions/types';

const initialState = {
  companies: [
    {
      id: 'idOne',
      name: 'Apple',
      description:
        "Apple Inc. is an American multinational technology company headquartered in Cupertino, California, that designs, develops, and sells consumer electronics, computer software, and online services. The company's hardware products include the iPhone smartphone, the iPad tablet computer, the Mac personal computer, the iPod portable media player, the Apple Watch smartwatch, the Apple TV digital media player, and the HomePod smart speaker. Apple's software includes the macOS and iOS operating systems, the iTunes media player, the Safari web browser, and the iLife and iWork creativity and productivity suites, as well as professional applications like Final Cut Pro, Logic Pro, and Xcode. Its online services include the iTunes Store, the iOS App Store and Mac App Store, Apple Music, and iCloud.",
      employees: [
        {
          id: '7sdf8werwsdfs27f5',
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
          id: '7swerdf8sdfs27f5',
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
          id: '7sdf8twetsdfs27f5',
          name: 'Samanta',
          phone: 8002225555,
          email: 'peter@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 4.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdf8sdfs2qwe7f5',
          name: 'Donald',
          phone: 8623334255,
          email: 'mike@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 2.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdtqt132f8sdfs27f5',
          name: 'Harry',
          phone: 8002225555,
          email: 'peter@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 4.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdf8sdf54sas27f5',
          name: 'John',
          phone: 8623334255,
          email: 'mike@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 2.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdfsdfa38sdfs27f5',
          name: 'Ander',
          phone: 8002225555,
          email: 'peter@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 4.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdf8sdfs222373f5',
          name: 'Jane',
          phone: 8623334255,
          email: 'mike@mail.com',
          department: 'HR',
          joinDate: '05/07/2007',
          rating: 2.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdf8s32rfadfs27f5',
          name: 'Sarah',
          phone: 8002225555,
          email: 'peter@mail.com',
          department: 'Finance',
          joinDate: '05/07/2010',
          rating: 4.5,
          avatar: 'https://cdn.dribbble.com/users/79851/screenshots/3676098/untitled-2.jpg',
          createdAt: ''
        },
        {
          id: '7sdf8aa3tgsdfs27f5',
          name: 'Tom',
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
    default:
      return state;
  }
};
