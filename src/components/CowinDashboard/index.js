import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiStatusConstants = {
  initial: 'INITITAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    last7DaysVaccinationList: [],
    vaccinationByAgeList: [],
    vaccinationByGenderList: [],
  }

  componentDidMount() {
    this.getFetchData()
  }

  getFetchData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const formatted7DaysList = data.last_7_days_vaccination.map(
        eachVaccination => ({
          vaccineDate: eachVaccination.vaccine_date,
          dose1: eachVaccination.dose_1,
          dose2: eachVaccination.dose_2,
        }),
      )
      const formattedAgeList = data.vaccination_by_age.map(eachVaccination => ({
        age: eachVaccination.age,
        count: eachVaccination.count,
      }))
      const formattedGenderList = data.vaccination_by_gender.map(
        eachVaccination => ({
          count: eachVaccination.count,
          gender: eachVaccination.gender,
        }),
      )
      this.setState({
        last7DaysVaccinationList: formatted7DaysList,
        vaccinationByAgeList: formattedAgeList,
        vaccinationByGenderList: formattedGenderList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {
      vaccinationByAgeList,
      vaccinationByGenderList,
      last7DaysVaccinationList,
    } = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={last7DaysVaccinationList}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationByGenderList}
        />
        <VaccinationByAge vaccinationByAgeDetails={vaccinationByAgeList} />
      </>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-contianer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-msg">Something Went Wrong</h1>
    </div>
  )

  renderRecharts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="website-logo-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p className="webiste-name">Co-WIN</p>
        </div>
        <h1 className="cowin-description">CoWIN Vaccination in India</h1>
        {this.renderRecharts()}
      </div>
    )
  }
}

export default CowinDashboard
