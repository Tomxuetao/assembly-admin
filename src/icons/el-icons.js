import {UploadFilled,
  Search,
  Download,
  Plus,
  User,
  Lock,
  Microphone,
  ChatRound,
  CaretBottom,
  ArrowRight,
  CircleCheck,
  Delete,
  Edit,
ArrowDown} from '@element-plus/icons-vue'

export default (app) => {
  app.component(UploadFilled.name, UploadFilled)
  app.component(Search.name, Search)
  app.component(Download.name, Download)
  app.component(Plus.name, Plus)
  app.component(User.name, User)
  app.component(Lock.name, Lock)
  app.component(Microphone.name, Microphone)
  app.component(ChatRound.name, ChatRound)
  app.component(CaretBottom.name, CaretBottom)
  app.component(ArrowRight.name, ArrowRight)
  app.component(ArrowDown.name, ArrowDown)
  app.component(CircleCheck.name, CircleCheck)
  app.component(Delete.name, Delete)
  app.component(Edit.name, Edit)
}

export { UploadFilled, Search, Download, Plus, User, Lock, Microphone, ChatRound, CaretBottom, ArrowRight, ArrowDown, CircleCheck, Delete, Edit }
