import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getMostEmployedCities, getTopBioEdByCountry, getTopInstituteByCountry, getTotalPapersByCountry } from '../fetcher'

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

const topInstitutionsByCountryColumns = [
  {
    title: 'Country',
    dataIndex: 'Country',
    key: 'Country',
  },
  {
    title: 'NumPapers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
  },
  {
    title: 'Organization',
    dataIndex: 'Organization',
    key: 'Organization',
  }
];

const topBioEdByCountryColumns = [
  {
    title: 'Mention',
    dataIndex: 'Mention',
    key: 'Mention',
  },
  {
    title: 'Count',
    dataIndex: 'Count',
    key: 'Count',
  }
];

const mostEmployedCitiesColumns = [
  {
    title: 'City',
    dataIndex: 'City',
    key: 'City',
  },
  {
    title: 'count',
    dataIndex: 'count',
    key: 'count',
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
      country: "IT",
      papersByCountries: [],
      topInstituteByCountry: [],
      topBioEdByCountry: [],
      mostEmployedCities: []

    }

    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  componentDidMount() {

    getTotalPapersByCountry(this.state.country, null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ papersByCountries: res.results})
      console.log('set state')
    })

    getTopInstituteByCountry(this.state.country, null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ topInstituteByCountry: res.results})
      console.log('set state')
    })

    getTopBioEdByCountry(this.state.country, null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ topBioEdByCountry: res.results})
      console.log('set state')
    })

    getMostEmployedCities(this.state.country, null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ mostEmployedCities: res.results})
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
        <Table dataSource={this.state.topInstituteByCountry} columns={topInstitutionsByCountryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Top Education By Country</h3>
        <Table dataSource={this.state.topBioEdByCountry} columns={topBioEdByCountryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Most Employed Cities</h3>
        <Table dataSource={this.state.mostEmployedCities} columns={mostEmployedCitiesColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      
      </div>
    </div>
    )
  }
}

export default CountriesPage

