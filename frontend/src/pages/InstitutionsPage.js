import React from 'react';
import {
  Table,
  Pagination,
  Select,
  Row,
  Col,
  Divider
} from 'antd'
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getMostBenefitedOrg, searchMostBenefitedOrg, getTopInstitutions, getBestAuthors } from '../fetcher'

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
      min: 0,
      max: 1000000,
      institutionsResults: [],
      bestAuthorsResults: [],
      mostBenefitedOrgResults: [],
    }

    this.handleOrganizationQueryChange = this.handleOrganizationQueryChange.bind(this)
    this.handleMinQueryChange = this.handleMinQueryChange.bind(this)
    this.handleMaxQueryChange = this.handleMaxQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)
    this.updateBenefitedSearchResults = this.updateBenefitedSearchResults.bind(this)

  }

  handleOrganizationQueryChange(event) {
    this.setState({ organization: event.target.value })
  }

  handleMinQueryChange(event) {
    this.setState({ min: event.target.value })
  }

  handleMaxQueryChange(event) {
    this.setState({ max: event.target.value })
  }

  updateSearchResults() {
    getTopInstitutions(this.state.organization,
      null, null).then( res => {
        this.setState({ institutionsResults: res.results })
    })
    console.log('done with updating search results');

  }

  updateBenefitedSearchResults() {
    console.log(this.state);
    searchMostBenefitedOrg(this.state.min, this.state.max,
      null, null).then( res => {
        this.setState({ mostBenefitedOrgResults: res.results })
    })
    console.log('done with updating search results');

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
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
    return (
      <div>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
      <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Organization</label>
                    <FormInput placeholder="organization" value={this.state.organization} onChange={this.handleOrganizationQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
        <h3>Top Researchers</h3>
        <Table dataSource={this.state.institutionsResults} columns={institutionsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Best Authors</h3>
        <Table dataSource={this.state.bestAuthorsResults} columns={bestAuthorsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Most Benefited Organization</h3>
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Min Count</label>
                    <FormInput placeholder="min" value={this.state.min} onChange={this.handleMinQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Max Count</label>
                    <FormInput placeholder="max" value={this.state.max} onChange={this.handleMaxQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateBenefitedSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
        <Table dataSource={this.state.mostBenefitedOrgResults} columns={mostBenefitedOrgColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default InstitutionsPage

