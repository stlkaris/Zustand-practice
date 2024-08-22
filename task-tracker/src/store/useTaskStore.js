import  create  from 'zustand';
import useMessageStore from '../store/useMessageStore';

const useTaskStore = create((set) => ({
//   tasks: [],
//   addTask: (task) => {
//     set((state) => ({ tasks: [...state.tasks, task] }));
//   },

    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    
    addTask: (task) => {
      try {
        set((state) => {
          if (!task.title.trim()) {
            useMessageStore.getState().setMessage('Task name cannot be empty', 'error');
            return state;
          }
          const updatedTasks = [...state.tasks, task];
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
          useMessageStore.getState().setMessage('Task added successfully', 'success');
          return { tasks: updatedTasks };
        });
      } catch (error) {
        console.error('Error adding task:', error);
        useMessageStore.getState().setMessage('Error adding task', 'error');
      }
    },
//   removeTask: (id) => {
//     set((state) => ({ tasks: state.tasks.filter(task => task.id !== id) }));
//   },
removeTask: (id) => {
    try {
      set((state) => {
        const updatedTasks = state.tasks.filter(task => task.id !== id);
        useMessageStore.getState().setMessage('Task removed successfully', 'success');
        return { tasks: updatedTasks };
      });
    } catch (error) {
      console.error('Error removing task:', error);
      useMessageStore.getState().setMessage('Error removing task', 'error');
    }
  },

//   toggleTask: (id) => {
//     set((state) => ({
//       tasks: state.tasks.map(task =>
//         task.id === id ? { ...task, completed: !task.completed } : task
//       )
//     }));
//   },

toggleTask: (id) => {
    try {
      set((state) => {
        const updatedTasks = state.tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ).sort((a, b) => a.completed - b.completed);
        useMessageStore.getState().setMessage('Task status updated', 'success');
        return { tasks: updatedTasks };
      });
    } catch (error) {
      console.error('Error toggling task:', error);
      useMessageStore.getState().setMessage('Error toggling task', 'error');
    }
  },
  fetchTasks: async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      set({ tasks: data.slice(0, 5) });
      useMessageStore.getState().setMessage('Tasks fetched successfully', 'success');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      useMessageStore.getState().setMessage('Error fetching tasks', 'error');
    }
  },
}));

export default useTaskStore;