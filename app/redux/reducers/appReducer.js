import { ADD_COMPANY, EDIT_COMPANY, DELETE_COMPANY, SORT_A_TO_Z } from '../actions/types';

const initialState = {
  companies: [
    {
      id: 'idOne',
      name: 'Apple',
      description: 'very good company ...',
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
      return { ...state, companies: action.payload };
    }
    case DELETE_COMPANY: {
      return { ...state, companies: action.payload };
    }
    case EDIT_COMPANY: {
      return { ...state, companies: action.payload };
    }
    case SORT_A_TO_Z: {
      return { ...state, companies: action.payload };
    }
    default:
      return state;
  }
};
