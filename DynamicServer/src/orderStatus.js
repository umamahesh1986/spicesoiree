// Order status lifecycle. Single source of truth: the server enforces it and sends
// labels / allowed next steps to the client, so screens never hard-code the rules.
//
//   placed -> confirmed -> preparing -> ready -> out_for_delivery -> delivered -> disputed -> resolved
//                                          \-> picked_up (pickup orders) -------/
//   out_for_delivery -> delivery_failed -> out_for_delivery (retry) | cancelled
//   placed / confirmed / preparing / ready / delivery_failed -> cancelled

const STATUSES = {
  placed: { label: 'Order placed', stage: 'open' },
  confirmed: { label: 'Confirmed', stage: 'open' },
  preparing: { label: 'Preparing', stage: 'open' },
  ready: { label: 'Ready', stage: 'open' }, // label depends on fulfilment, see statusLabel()
  out_for_delivery: { label: 'Delivery partner on the way', stage: 'open' },
  delivery_failed: { label: 'Delivery attempt failed', stage: 'open' },
  delivered: { label: 'Delivered', stage: 'completed' },
  picked_up: { label: 'Picked up', stage: 'completed' },
  disputed: { label: 'Disputed', stage: 'open' }, // needs admin action
  resolved: { label: 'Dispute resolved', stage: 'closed' },
  cancelled: { label: 'Cancelled', stage: 'closed' },
};

// Allowed transitions per fulfilment type
const TRANSITIONS = {
  delivery: {
    placed: ['confirmed', 'preparing', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['out_for_delivery', 'cancelled'],
    out_for_delivery: ['delivered', 'delivery_failed'],
    delivery_failed: ['out_for_delivery', 'cancelled'],
    delivered: ['disputed'],
    disputed: ['resolved'],
  },
  pickup: {
    placed: ['confirmed', 'preparing', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['picked_up', 'cancelled'],
    picked_up: ['disputed'],
    disputed: ['resolved'],
  },
};

// Statuses that need a written reason / note when entered
const NOTE_REQUIRED = {
  cancelled: 'Please give a reason for cancelling.',
  delivery_failed: 'Please describe why the delivery failed.',
  disputed: 'Please describe the problem.',
  resolved: 'Please describe how the dispute was resolved.',
};

// Customers may only do these
const CUSTOMER_CANCELLABLE = ['placed', 'confirmed'];
const DISPUTE_WINDOW_HOURS = 48;

const OPEN_STATUSES = Object.keys(STATUSES).filter((s) => STATUSES[s].stage === 'open');
const COMPLETED_STATUSES = ['delivered', 'picked_up'];

function statusLabel(status, fulfilmentType) {
  if (status === 'ready') {
    return fulfilmentType === 'pickup' ? 'Ready for pickup' : 'Ready for dispatch';
  }
  return STATUSES[status]?.label || status;
}

function nextStatuses(status, fulfilmentType) {
  return TRANSITIONS[fulfilmentType]?.[status] || [];
}

function canTransition(status, next, fulfilmentType) {
  return nextStatuses(status, fulfilmentType).includes(next);
}

function customerCanCancel(order) {
  return CUSTOMER_CANCELLABLE.includes(order.status);
}

function customerCanDispute(order) {
  if (!COMPLETED_STATUSES.includes(order.status) || !order.completed_at) return false;
  const hours = (Date.now() - new Date(order.completed_at).getTime()) / 36e5;
  return hours <= DISPUTE_WINDOW_HOURS;
}

// Status list for filters / legends on the client
function statusCatalog() {
  return Object.entries(STATUSES).map(([key, s]) => ({ key, label: s.label, stage: s.stage }));
}

module.exports = {
  STATUSES,
  NOTE_REQUIRED,
  OPEN_STATUSES,
  COMPLETED_STATUSES,
  DISPUTE_WINDOW_HOURS,
  statusLabel,
  nextStatuses,
  canTransition,
  customerCanCancel,
  customerCanDispute,
  statusCatalog,
};
