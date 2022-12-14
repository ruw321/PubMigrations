import React from 'react';
import {
  Table,
  Pagination,
  Spin,
  Row,
  Col,
  Slider,
} from 'antd'
import Select from 'react-select';
import { Form, FormInput, FormGroup, Button } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getMostBenefitedOrg, searchMostBenefitedOrg, getTopInstitutions, getBestAuthors, getAllOrganizations } from '../fetcher'

const institutionsColumns = [
  {
    title: 'ANDID',
    dataIndex: 'ANDID',
    key: 'ANDID',
    sorter: (a, b) => a.ANDID - b.ANDID

  },
  {
    title: 'NumPapers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
    sorter: (a, b) => a.NumPapers - b.NumPapers
  }
];

const bestAuthorsColumns = [
    {
      title: 'Organization',
      dataIndex: 'Organization',
      key: 'Organization',
      sorter: (a, b) => a.Organization.localeCompare(b.Organization)
    },
    {
      title: 'City',
      dataIndex: 'City',
      key: 'City',
      sorter: (a, b) => a.City.localeCompare(b.City)
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count
    }
  ];

  const mostBenefitedOrgColumns = [
    {
      title: 'Organization',
      dataIndex: 'Organization',
      key: 'Organization',
      sorter: (a, b) => a.Organization.localeCompare(b.Organization)
    },
    {
      title: 'Percentage',
      dataIndex: 'Percentage',
      key: 'Percentage',
      sorter: (a, b) => a.Percentage - b.Percentage
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

      loadingResearchers: true,
      loadingBestAuthors: true,
      loadingMostBenefited: true,
      organizations: [],
      organization: "Tsinghua University",
      min: 0,
      max: 1,
      institutionsResults: [],
      bestAuthorsResults: [],
      mostBenefitedOrgResults: [],
    }

    this.handleOrganizationQueryChange = this.handleOrganizationQueryChange.bind(this)
    this.handleMinMaxQueryChange = this.handleMinMaxQueryChange.bind(this)
    this.handleMinQueryChange = this.handleMinQueryChange.bind(this)
    this.handleMaxQueryChange = this.handleMaxQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)
    this.updateBenefitedSearchResults = this.updateBenefitedSearchResults.bind(this)

  }

  // handleOrganizationQueryChange(event) {
  //   this.setState({ organization: event.target.value })
  // }

  handleOrganizationQueryChange(value) {
    console.log("value here:", value)
    this.setState({ organization: value })
  }

  handleMinQueryChange(event) {
    this.setState({ min: event.target.value })
  }

  handleMaxQueryChange(event) {
    this.setState({ max: event.target.value })
  }

  handleMinMaxQueryChange(values) {
    console.log(values[0]/100);
    console.log(values[1]/100);
    this.setState({ min: values[0]/100 })
    this.setState({ max: values[1]/100})
  }

  updateSearchResults() {
    this.setState({ loadingResearchers: true })
    getTopInstitutions(this.state.organization,
      null, null).then( res => {
        this.setState({ institutionsResults: res.results })
        this.setState({ loadingResearchers: false })
    })
    console.log('done with updating search results');

  }

  updateBenefitedSearchResults() {
    console.log(this.state);
    this.setState({ loadingMostBenefited: true })
    searchMostBenefitedOrg(this.state.min, this.state.max,
      null, null).then( res => {
        this.setState({ mostBenefitedOrgResults: res.results })
        this.setState({ loadingMostBenefited: false })
    })
    console.log('done with updating search results');

  }

  componentDidMount() {

    getAllOrganizations(null, null).then(res => {
    console.log(res.results)
    let newResults = [];
    for (let i in res.results){
      console.log(i);
      let label = res.results[i].Organization;
      let value = res.results[i].Organization;
      let d = {label: label, value: value};
      newResults.push(d);
    }
    console.log(newResults);
    this.setState({ organizations: newResults})
    console.log('set state')
  })

    getBestAuthors().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ bestAuthorsResults: res.results})
      console.log('set state')
      this.setState({ loadingBestAuthors: false })
    })

    getTopInstitutions(this.state.organization).then(res => {
        console.log(res.results)
        // TASK 1: set the correct state attribute to res.results
        this.setState({ institutionsResults: res.results})
        console.log('set state')
        this.setState({ loadingResearchers: false })
      })

    getMostBenefitedOrg().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ mostBenefitedOrgResults: res.results})
      console.log('set state')
      this.setState({ loadingMostBenefited: false })
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
                    <Select style={{ width: '20vw', margin: '0 auto' }} defaultValue="Tsinghua University" options={this.state.organizations} onChange={this.handleOrganizationQueryChange}></Select>

                    {/* <FormInput placeholder="organization" value={this.state.organization} onChange={this.handleOrganizationQueryChange} /> */}
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
        <h3>Top Researchers</h3>
        <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingResearchers}} dataSource={this.state.institutionsResults} columns={institutionsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Best Authors</h3>
        <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingBestAuthors}} dataSource={this.state.bestAuthorsResults} columns={bestAuthorsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Most Benefited Organization</h3>
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Percentage Range Slider (0 to 100 %)</label>
                    {/* <FormInput placeholder="min" value={this.state.min} onChange={this.handleMinQueryChange} /> */}
                    <Slider range={{ draggableTrack: true }} defaultValue={[0, 100]} onChange={this.handleMinMaxQueryChange}/>
                </FormGroup></Col>
                {/* <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Max Percentage (between 0 and 1)</label>
                    <FormInput placeholder="max" value={this.state.max} onChange={this.handleMaxQueryChange} />
                </FormGroup></Col> */}
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateBenefitedSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
        <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingMostBenefited}} dataSource={this.state.mostBenefitedOrgResults} columns={mostBenefitedOrgColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default InstitutionsPage

