import { createSelector } from 'reselect'

const selectRegistrationList = state => state.registeredCourses
const selectSessionList = state => state.sessions
const selectSubjectId = (state, props) => props.subjectId
const selectRegistrationId = (state, props) => props.registrationId

export const selectRegistrationObject = createSelector([
  selectRegistrationList,
  selectRegistrationId
], (registerObj, registrationId) => {
  return registerObj.find(reg => reg.id === registrationId)
})

export const selectSessionListBySubjectId = createSelector([
  selectSessionList,
  selectSubjectId
], (sessionList, subjectId) => {
  return sessionList.filter(function(course) {
    return course.subjectId === subjectId
  })
})

export const selectIsAllowRegister = createSelector([
  selectRegistrationObject
], (regObj) => {
  return ['venueFee', 'remainings'].every(id => regObj.selectedPaymentIds.indexOf(id) > -1)
})

export const composeSessionListWithSelectedSession = createSelector([
  selectSessionListBySubjectId,
  selectRegistrationObject,
  selectSubjectId
], (sessionList, regObj, subjectId) => {

  const registeredClassSessions = regObj.registeredClassSessions
  const selectedSessionId = registeredClassSessions ? registeredClassSessions.find(session => subjectId === subjectId).id : ''
  return sessionList.map(session => {
    return Object.assign({}, session, {
      isSelected: session.id === selectedSessionId
    })
  })
})
