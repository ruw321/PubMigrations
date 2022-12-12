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
import { getPublications, getSearchPublications } from '../fetcher'

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

      andid: null,
      pmid: null,
      auOrder: null,
      pubYear: null,
      publicationsResults: []  
    }

    this.handleAndidQueryChange = this.handleAndidQueryChange.bind(this)
    this.handlePmidQueryChange = this.handlePmidQueryChange.bind(this)
    this.handleAuOrderQueryChange = this.handleAuOrderQueryChange.bind(this)
    this.handlePubYearQueryChange = this.handlePubYearQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)
  }

  handleAndidQueryChange(event) {
    this.setState({ andid: event.target.value })
  }

  handlePmidQueryChange(event) {
    this.setState({ pmid: event.target.value })
  }

  handleAuOrderQueryChange(event) {
    this.setState({ auOrder: event.target.value })
  }

  handlePubYearQueryChange(event) {
    this.setState({ pubYear: event.target.value })
  }

  updateSearchResults() {
    getSearchPublications(this.state.andid, this.state.pmid, this.state.auOrder, this.state.pubYear,
      null, null).then( res => {
        this.setState({ publicationsResults: res.results })
    })
    console.log('done with updating search results');

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
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
    return (
      <div>
      <MenuBar />
      <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>ANDID</label>
                    <FormInput placeholder="andid" value={this.state.andid} onChange={this.handleAndidQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>PMID</label>
                    <FormInput placeholder="pmid" value={this.state.pmid} onChange={this.handlePmidQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>AuOrder</label>
                    <FormInput placeholder="AuOrder" value={this.state.auOrder} onChange={this.handleAuOrderQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>PubYear</label>
                    <FormInput placeholder="pubYear" value={this.state.pubYear} onChange={this.handlePubYearQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Publications</h3>
        <Table dataSource={this.state.publicationsResults} columns={publicationsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default PublicationsPage

