import Api from '@/services/Api';

export default {
  create(employee) {
    return Api().post('employee/create', employee)
  },
  find(params) {
    return Api().get('employee/list', { params })
  },
  update(_id, employee, token) {
    return Api().put(`employee/update/${_id}`, employee, { headers: token })
  },
  remove(_id) {
    return Api().delete(`employee/delete/${_id}`)
  },
  count() {
    return Api().get('employee/count');
  },
}