import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllMigrations } from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const migrationColumns = [
  {
    title: 'ORCID',
    dataIndex: 'ORCID',
    key: 'ORCID',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'PhdYear',
    dataIndex: 'PhdYear',
    key: 'PhdYear',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'Country2016',
    dataIndex: 'Country2016',
    key: 'Country2016',
    // sorter: (a, b) => a.Rating - b.Rating
    
  },
  // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
  {
    title: 'EarliestYear',
    dataIndex: 'EarliestYear',
    key: 'EarliestYear',
    // sorter: (a, b) => a.Potential - b.Potential
  },
  // TASK 8: add a column for Club, with the ability to (alphabetically) sort 
  {
    title: 'EarliestCountry',
    dataIndex: 'Club',
    key: 'Club',
    // sorter: (a, b) => a.Club.localeCompare(b.Club)
  },
  {
    title: 'HasPhd',
    dataIndex: 'HasPhd',
    key: 'HasPhd'
  },
  {
    title: 'PhdCountry',
    dataIndex: 'PhdCountry',
    key: 'PhdCountry'
  },
  {
    title: 'HasMigrated',
    dataIndex: 'HasMigrated',
    key: 'HasMigrated'
  }

];

class MigrationsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      playersResults: [],
      pagination: null,
      migrationsResults: []  
    }

    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  componentDidMount() {

    getAllMigrations().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ migrationsResults: res.results})
      console.log('got here')
    })
  }

  render() {
    return (
      <div>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Migrations</h3>
        <Table dataSource={this.state.migrationsResults} columns={migrationColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default MigrationsPage

