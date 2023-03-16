import { defineStore } from 'pinia'

export const useTodos = defineStore('todos',{
    state:()=>({
        todos:[],
        filter:'all',
        nextId:0
    }),
    getters:{
        finishedTodos(state){
            return state.todos.filter((todo)=>todo.isFinished)
        },
        unfinishedTodos(state){
            return state.todos.filter((todo)=> !todo.isFinished)
        },
        filterdTodos(state){
            if(this.filter == 'finished'){
                return this.finishedTodos
            }else if(this.filter == 'undefined'){
                return this.unfinishedTodos
            }
            return this.todos
        }
    },
    actions:{
        addTodo(text,isF){
            this.todos.push({text,id:this.nextId++,isFinished:isF})
        }
    }
})