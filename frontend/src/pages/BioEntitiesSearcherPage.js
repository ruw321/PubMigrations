import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getPaperWords } from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const bioEntitiesColumns = [
  {
    title: 'PMID',
    dataIndex: 'PMID',
    key: 'PMID',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'TermsFound',
    dataIndex: 'TermsFound',
    key: 'TermsFound',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'Count',
    dataIndex: 'Count',
    key: 'COunt',
    // sorter: (a, b) => a.Rating - b.Rating
  }
];

class BioEntitiesSearcherPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,
      wordsList: "brain,neurology",
      bioEntitiesResults: []  
    }

    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  componentDidMount() {

    getPaperWords(this.state.wordsList, null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ bioEntitiesResults: res.results})
      console.log('set state')
    })
  }

  render() {
    return (
      <div>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Bio Entities Searcher</h3>
        <Table dataSource={this.state.bioEntitiesResults} columns={bioEntitiesColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default BioEntitiesSearcherPage

