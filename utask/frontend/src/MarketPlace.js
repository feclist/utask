import React, { Component } from 'react'
import TaskCard from './components/TaskCard'

export default class MarketPlace extends Component {
  state = {
    tasks: [
      {
        id: 1,
        created_time: '2018-07-22T21:59:56.707430Z',
        end_time: '2018-07-22T22:04:59.413013Z',
        description:
          'Like and follow Barzz400 on SoundCloud to give him some traction and get his rap-carreer moving.',
        reward: 5.0,
        title: 'Like Barzz400 on SoundCloud',
        type: 'Anon',
        total_cost: 25,
        amount: 5,
        active: false,
        user: 1,
        completions: [1, 2, 3],
        live_task: [123]
      },
      {
        id: 2,
        created_time: '2018-08-18T21:59:56.707430Z',
        end_time: '2018-08-12T09:04:59.413013Z',
        description:
          "DefinitelyNotACryptoMiner wants you to grab a digital pickaxe and mine some ores for them. \"It's not for mining crypto, don't worry about it\" says DNACM CEO, Rich Bastardious while holding four 1080Ti's in his hands.",
        reward: 4.0,
        title: 'Click this pickaxe and mine some ores',
        type: 'Anon',
        total_cost: 800,
        amount: 200,
        active: false,
        user: 2,
        completions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        live_task: [123, 243]
      }
    ]
  }

  render() {
    return this.state.tasks.map(task => <TaskCard task={task} />)
  }
}
