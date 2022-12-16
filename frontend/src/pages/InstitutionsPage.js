import React from 'react';
import {
  Table,
  Spin,
  Row,
  Col,
  Slider,
} from 'antd'
import { Form, FormGroup, Button } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getMostBenefitedOrg, searchMostBenefitedOrg } from '../fetcher'

// const institutionsColumns = [
//   {
//     title: 'ANDID',
//     dataIndex: 'ANDID',
//     key: 'ANDID',
//     sorter: (a, b) => a.ANDID - b.ANDID

//   },
//   {
//     title: 'NumPapers',
//     dataIndex: 'NumPapers',
//     key: 'NumPapers',
//     sorter: (a, b) => a.NumPapers - b.NumPapers
//   }
// ];

// const bestAuthorsColumns = [
//   {
//     title: 'Organization',
//     dataIndex: 'Organization',
//     key: 'Organization',
//     sorter: (a, b) => a.Organization.localeCompare(b.Organization)
//   },
//   {
//     title: 'City',
//     dataIndex: 'City',
//     key: 'City',
//     sorter: (a, b) => a.City.localeCompare(b.City)
//   },
//   {
//     title: 'Count',
//     dataIndex: 'count',
//     key: 'count',
//     sorter: (a, b) => a.count - b.count
//   }
// ];

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
    sorter: (a, b) => a.Percentage - b.Percentage,
    render: (_, record) => (
      <div> {parseFloat(record.Percentage * 100).toFixed(2)} </div>
    )
  }
];

class InstitutionsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {

      // loadingResearchers: false,
      // loadingBestAuthors: true,
      loadingMostBenefited: true,
      // organizations: [],
      // organization: "",
      min: 0,
      max: 1,
      // institutionsResults: [],
      // bestAuthorsResults: [],
      mostBenefitedOrgResults: [],
    }

    // this.handleOrganizationQueryChange = this.handleOrganizationQueryChange.bind(this)
    this.handleMinMaxQueryChange = this.handleMinMaxQueryChange.bind(this)
    this.handleMinQueryChange = this.handleMinQueryChange.bind(this)
    this.handleMaxQueryChange = this.handleMaxQueryChange.bind(this)
    // this.updateSearchResults = this.updateSearchResults.bind(this)
    this.updateBenefitedSearchResults = this.updateBenefitedSearchResults.bind(this)

  }

  // handleOrganizationQueryChange(event) {
  //   this.setState({ organization: event.target.value })
  // }

  // handleOrganizationQueryChange(value) {
  //   this.setState({ organization: value })
  // }

  handleMinQueryChange(event) {
    this.setState({ min: event.target.value })
  }

  handleMaxQueryChange(event) {
    this.setState({ max: event.target.value })
  }

  handleMinMaxQueryChange(values) {
    //console.log(values[0]/100);
    //console.log(values[1]/100);
    this.setState({ min: values[0] / 100 })
    this.setState({ max: values[1] / 100 })
  }

  // updateSearchResults() {
  //   this.setState({ loadingResearchers: true })
  //   console.log(this.state.organization);
  //   getTopResearchers(this.state.organization).then(res => {
  //     console.log(res.results)
  //     this.setState({ institutionsResults: res.results })
  //     this.setState({ loadingResearchers: false })
  //   })

  // }

  updateBenefitedSearchResults() {

    // this.setState({ loadingResearchers: true })
    // getTopResearchers(this.state.organization).then(res => {
    //   //console.log(res.results)
    //   this.setState({ institutionsResults: res.results })
    //   this.setState({ loadingResearchers: false })
    // })

    this.setState({ loadingMostBenefited: true })
    searchMostBenefitedOrg(this.state.min, this.state.max,
      null, null).then(res => {
        this.setState({ mostBenefitedOrgResults: res.results })
        this.setState({ loadingMostBenefited: false })
      })

  }

  componentDidMount() {

    // getAllOrganizations(null, null).then(res => {
    //   //console.log(res.results)
    //   let newResults = [];
    //   for (let i in res.results) {
    //     let label = res.results[i].Organization;
    //     let value = res.results[i].Organization;
    //     let d = { label: label, value: value };
    //     newResults.push(d);
    //   }
    //   //console.log(newResults);
    //   this.setState({ organizations: newResults })
    // })



    // getBestAuthors().then(res => {
    //   //console.log(res.results)
    //   this.setState({ bestAuthorsResults: res.results })
    //   console.log('set state')
    //   this.setState({ loadingBestAuthors: false })
    // })

    // getTopResearchers(this.state.organization).then(res => {
    //     //console.log(res.results)
    //     this.setState({ institutionsResults: res.results})
    //     this.setState({ loadingResearchers: false })
    //   })

    getMostBenefitedOrg().then(res => {
      //console.log(res.results)
      this.setState({ mostBenefitedOrgResults: res.results })
      this.setState({ loadingMostBenefited: false })
    })
  }

  render() {
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          {/* <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>

            <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Organization</label>
                <FormInput placeholder="organization" value={this.state.organization} onChange={this.handleOrganizationQueryChange} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>
            </Row>
          </Form> */}
          {/* <h3>Top Researchers</h3>
          <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingResearchers }} dataSource={this.state.institutionsResults} columns={institutionsColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
          <h3>Best Authors</h3>
          <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingBestAuthors }} dataSource={this.state.bestAuthorsResults} columns={bestAuthorsColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} /> */}
          <h3>Institution Percentage </h3>
          <h6> Percentage of papers written by a researcher that has migrated</h6>
          <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Percentage Range Slider (0 to 100 %)</label>

                <Slider range={{ draggableTrack: true }} defaultValue={[0, 100]} onChange={this.handleMinMaxQueryChange} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button style={{ marginTop: '4vh' }} onClick={this.updateBenefitedSearchResults}>Search</Button>
              </FormGroup></Col>
            </Row>
          </Form>
          <Table rowKey="Organization" bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingMostBenefited }} dataSource={this.state.mostBenefitedOrgResults} columns={mostBenefitedOrgColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
        </div>
      </div>
    )
  }
}

export default InstitutionsPage

