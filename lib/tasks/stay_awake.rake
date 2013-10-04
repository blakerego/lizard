desc "Visit "
task :call_page => :environment do
   uri = URI.parse('http://lizard.herokuapp.com')
   Net::HTTP.get(uri)
   puts 'page visited'
 end