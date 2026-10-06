Config = {}

Config.Debug = false 

function DebugLog(...)
    if Config.Debug then
        print(...)
    end
end

Config.MenuCommand = 'adminmenu' 
Config.MenuKey = 'F11'           
Config.NoclipKey = 'PAGEUP'      
Config.Framework = 'autodetect'  


Config.WarnsToBan = 3            
Config.AutoBanDuration = 3       


Config.Bans = {
    AppealURL = "https://discord.gg/yourserver",
    ServerName = "Xeno Server",
    LogoURL = "https://i.imgur.com/yourlogo.png", 
    DefaultReason = "No reason specified."
}


Config.Registration = {
    CooldownMinutes = 30,             
    MinReasonLength = 10,             
    MaxReasonLength = 500,            
    MaxRejectReasonLength = 500,      
}


Config.WeatherSync = {
    Enabled = true,                     
    Debug = true,                       
    DefaultWeather = "CLEAR",           
    DefaultTime = { hour = 8, minute = 0 }, 
    TimeScale = 2,                      
    SafetyResyncInterval = 60,          
    Persistence = true,                 
    
    DynamicWeather = {
        Enabled = false,                
        Interval = 20,                  
        AllowedWeather = {              
            "CLEAR", "EXTRASUNNY", "CLOUDS", "OVERCAST", "RAIN", "CLEARING", "THUNDER", "SMOG", "FOGGY"
        }
    }
}
