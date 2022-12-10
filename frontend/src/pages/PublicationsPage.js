import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getPublications } from '../fetcher'

const { Column, ColumnGroup } = Table;
const { Option } = Select;

const publicationsColumns = [
  {
    title: 'PMID',
    dataIndex: 'PMID',
    key: 'PMID',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'ANDID',
    dataIndex: 'ANDID',
    key: 'ANDID',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'LastName',
    dataIndex: 'LastName',
    key: 'LastName',
    // sorter: (a, b) => a.Rating - b.Rating
    
  },
  // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
  {
    title: 'Initials',
    dataIndex: 'Initials',
    key: 'Initials',
    // sorter: (a, b) => a.Potential - b.Potential
  },
  {
    title: 'PubYear',
    dataIndex: 'PubYear',
    key: 'PubYear',
    // sorter: (a, b) => a.Potential - b.Potential
  },
  {
    title: 'AuOrder',
    dataIndex: 'AuOrder',
    key: 'AuOrder',
    // sorter: (a, b) => a.Potential - b.Potential
  }
];

class PublicationsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,
      publicationsResults: []  
    }

    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  componentDidMount() {

    getPublications().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ publicationsResults: res.results})
      console.log('set state')
    })
  }

  render() {
    return (
      <div>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Publications</h3>
        <Table dataSource={this.state.publicationsResults} columns={publicationsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default PublicationsPage

