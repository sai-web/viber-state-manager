# Viber State Management

This is module to handle all the global state management of your React applications. It is inspired from the [pulse-framework](https://github.com/pulse-framework/pulse) module. Custom methods are setup for controlling the states and collections as you please.

## First steps
```
git clone https://github.com/sai-web/viber-state-manager.git
```
<b>An npm package will be launched soon. The updates will be avaible on my [discord](http://discord.gg/n9rVDZh)</b>

## Syntax
Create an instance of Viber to get access to the functionality.
```
const App = new Viber()
```
Create states, collections etc by calling the respective functions from the Viber instance.
```
const State = App.State<string>("")
interface DataItem{
    name: string
    date : Date
}
const Collection = App.Collection<DataItem>(collection => ({
    primaryKey: 'id', // default
    groups: {
        group1 : collection.Group()
    }
}))
```
Seggregate all the states, routes, collections and actions inside individual controllers to make your code more modular.
```
const Controller = App.Controller({
    states: {},
    collections: {},
    actions: {},
    events: {},
    routes: {}
})
```

## Working on
Im currently building a context provider to allow the components to subscribe to specifc states and collections. 