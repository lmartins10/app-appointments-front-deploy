'use server'

export async function LogErrorOnServerSide(error: string, writeLog = false) {
  console.error(error)

  if (writeLog) {
    const fs = await import('fs').then((m) => m.default)
    const path = await import('path').then((m) => m.default)
    const logFile = path.join(process.cwd(), 'logs', 'log-errors.log')
    const logDir = path.dirname(logFile)

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${error}\n`)
  }
}
