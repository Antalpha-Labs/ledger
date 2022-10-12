// 0 成功
// 1 未知错误
// 2 过期
// 3 参数错误
// 4 验证 ETH 签名错误
// 5 验证 jwt 错误
// 10 管理员权限

const code = {
  ok: 0,
  error: 1,
  expired: 2,
  noParams: 3,
  verifySignError: 4,
  verifyTokenError: 5,
  admin: 10
}

export default code;