import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getPublications, getTotalPapersByCountry } from '../fetcher'

const { Column, ColumnGroup } = Table;
const { Option } = Select;

const papersByCountriesColumns = [
  {
    title: 'Country',
    dataIndex: 'Country',
    key: 'Country',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'NumPapers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  }
];

class CountriesPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,
      papersByCountries: []  
    }

    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  componentDidMount() {

    getTotalPapersByCountry().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ papersByCountries: res.results})
      console.log('set state')
    })
  }

  render() {
    return (
      <div>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Total Papers By Country</h3>
        <Table dataSource={this.state.papersByCountries} columns={papersByCountriesColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Top Institutions By Country</h3>
        {/* <Table dataSource={this.state.publicationsResults} columns={publicationsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/> */}
        <h3>Top Education By Country</h3>
        {/* <Table dataSource={this.state.publicationsResults} columns={publicationsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/> */}
        <h3>Most Employed Cities</h3>
        {/* <Table dataSource={this.state.publicationsResults} columns={publicationsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/> */}
      
      </div>
    </div>
    )
  }
}

export default CountriesPage

