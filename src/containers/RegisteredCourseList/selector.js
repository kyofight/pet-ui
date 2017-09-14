import { createSelector } from 'reselect'

const selectRegisteredCourses = (state) => state.registeredCourses
const selectCourses = (state) => state.courses

export const getComposedRegisteredList = createSelector([
  selectRegisteredCourses,
  selectCourses,
], (registered, full) => {

  if (registered.length == 0 || full.length == 0) return

  // merge the details
  let list = registered.map(reg => {

    reg.selectedPaymentIds = reg.paymentStages
    delete reg.paymentStages


    let incompletePaymentIds

    let courseDetails = full.find(c => {
        return c.id === reg.courseId
      }) || {}

    if (courseDetails && courseDetails.paymentStages) {

      incompletePaymentIds = courseDetails.paymentStages.map(stage => stage.id).filter(id => reg.selectedPaymentIds.indexOf(id) === -1)

      courseDetails.paymentStages = courseDetails.paymentStages.map(stage => {
        return Object.assign({}, stage, {
          paid: reg.selectedPaymentIds.indexOf(stage.id) > -1
        })
      })
    }

    return Object.assign({}, reg, {
      registrationId: reg.id,
      title: courseDetails.title,
      description: courseDetails.description,
      subjects: courseDetails.subjects,
      paymentStages: courseDetails.paymentStages,
      incompletePaymentIds
    })
  })

  return list.filter(course => {
    return !!course.title
  })
})

export default getComposedRegisteredList
