export default function getColorClas(statusName) {
  switch (statusName) {
    case 'Open':
      return {
        background: 'bg-[#3300FF]',
        text: 'text-[#3300FF]', // Màu chữ trắng khi nền màu xanh
        borderColor: 'border-[#3300FF]'
      }
    case 'Assigned':
      return {
        background: 'bg-[#FFFF00]',
        text: 'text-[#FFFF00]',
        borderColor: 'border-[#FFFF00]'
      }
    case 'Work in progress':
      return {
        background: 'bg-[#FF6600]',
        text: 'text-[#FF6600]',
        borderColor: 'border-[#FF6600]'
      }
    case 'Need more info':
      return {
        background: 'bg-[#FF0033]',
        text: 'text-[#FF0033]',
        borderColor: 'border-[#FF0033]'
      }
    case 'Rejected':
      return {
        background: 'bg-[#FF0000]',
        text: 'text-[#FF0000]',
        borderColor: 'border-[#FF0000]'
      }
    case 'Completed':
      return {
        background: 'bg-[#33FF33]',
        text: 'text-[#33FF33]',
        borderColor: 'border-[#33FF33]'
      }
    case 'Closed':
      return {
        background: 'bg-[#FF0000]',
        text: 'text-[#FF0000]',
        borderColor: 'border-[#FF0000]'
      }
    default:
      return {
        background: 'bg-[#808080]',
        text: 'text-[#808080]',
        borderColor: 'border-[#808080]'
      }
  }
}
