import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodePanelProps {
  currentUrl: string
}

export const QRCodePanel: React.FC<QRCodePanelProps> = ({ currentUrl }) => {
  const { t } = useTranslation()

  // Build URL without the qrcode parameter
  const qrCodeUrl = useMemo(() => {
    const url = new URL(currentUrl)
    url.searchParams.delete('qrcode')
    return url.toString()
  }, [currentUrl])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        {t('qrCode.title', 'Open on Mobile')}
      </h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        {t('qrCode.description', 'Scan this QR code with your mobile device to open this departure board')}
      </p>
      <div className="flex justify-center bg-white p-4">
        <QRCodeSVG
          value={qrCodeUrl}
          size={200}
          level="M"
          includeMargin={true}
        />
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center break-all">
        {qrCodeUrl}
      </p>
    </div>
  )
}
