import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getMostBenefitedOrg, getTopInstitutions, getBestAuthors } from '../fetcher'

const { Column, ColumnGroup } = Table;
const { Option } = Select;

const institutionsColumns = [
  {
    title: 'ANDID',
    dataIndex: 'ANDID',
    key: 'ANDID',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'NumPapers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
    // sorter: (a, b) => a.Rating - b.Rating
  }
];

const bestAuthorsColumns = [
    {
      title: 'Organization',
      dataIndex: 'Organization',
      key: 'Organization',
      // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
    },
    {
      title: 'City',
      dataIndex: 'City',
      key: 'City',
      // sorter: (a, b) => a.Rating - b.Rating
    },
    {
      title: 'count',
      dataIndex: 'count',
      key: 'count',
      // sorter: (a, b) => a.Rating - b.Rating
    }
  ];

  const mostBenefitedOrgColumns = [
    {
      title: 'Organization',
      dataIndex: 'Organization',
      key: 'Organization',
      // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
    },
    {
      title: 'Percentage',
      dataIndex: 'Percentage',
      key: 'Percentage',
      // sorter: (a, b) => a.Rating - b.Rating
    }
  ];

class InstitutionsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,
      organization: "Tsinghua University",
      publicationsResults: [],
      bestAuthorsResults: [],
      mostBenefitedOrgResults: [],
    }

    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  componentDidMount() {

    getBestAuthors().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ bestAuthorsResults: res.results})
      console.log('set state')
    })

    getTopInstitutions(this.state.organization).then(res => {
        console.log(res.results)
        // TASK 1: set the correct state attribute to res.results
        this.setState({ institutionsResults: res.results})
        console.log('set state')
      })

    getMostBenefitedOrg().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ mostBenefitedOrgResults: res.results})
      console.log('set state')
    })
  }

  render() {
    return (
      <div>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Top Researchers</h3>
        <Table dataSource={this.state.institutionsResults} columns={institutionsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Best Authors</h3>
        <Table dataSource={this.state.bestAuthorsResults} columns={bestAuthorsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Most Benefited Organization</h3>
        <Table dataSource={this.state.mostBenefitedOrgResults} columns={mostBenefitedOrgColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default InstitutionsPage

