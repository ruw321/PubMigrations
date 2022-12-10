import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllResearchers } from '../fetcher'
import BioEntitiesSearcherPage from './BioEntitiesSearcherPage';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const researchersColumns = [
  {
    title: 'ANDID',
    dataIndex: 'ANDID',
    key: 'ANDID',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'LastName',
    dataIndex: 'LastName',
    key: 'LastName',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'Initials',
    dataIndex: 'Initials',
    key: 'Initials',
    // sorter: (a, b) => a.Rating - b.Rating
    
  },
  // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
  {
    title: 'BeginYear',
    dataIndex: 'BeginYear',
    key: 'BeginYear',
    // sorter: (a, b) => a.Potential - b.Potential
  }
];

class ResearchersPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,
      researchersResults: []  
    }

    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  componentDidMount() {

    getAllResearchers().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ researchersResults: res.results})
      console.log('set state')
    })
  }

  render() {
    return (
      <div>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Researchers</h3>
        <Table dataSource={this.state.researchersResults} columns={researchersColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default ResearchersPage

